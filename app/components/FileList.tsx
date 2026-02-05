"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import { Folder, Star, Trash, ExternalLink } from "lucide-react";
import { toast } from "sonner"; 
import type { File as FileType } from "@/lib/db/schema";


import FileEmptyState from "@/app/components/FileEmptyState";
import FileIcon from "@/app/components/FileIcon";
import FileActions from "@/app/components/FileActions";
import FileLoadingState from "@/app/components/FileLoadingState";
import FileTabs from "@/app/components/FileTabs";
import FolderNavigation from "@/app/components/FolderNavigation";
import FileActionButtons from "@/app/components/FileActionButtons";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null, folderName: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Loading states
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false);

  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) {
        url += `&parentId=${currentFolder}`;
      }

      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error Loading Files", {
        description: "We couldn't load your files. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch files when userId, refreshTrigger, or currentFolder changes
  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  // Filter files based on active tab
  const filteredFiles = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return files.filter((file) => file.isStarred && !file.isTrash);
      case "trash":
        return files.filter((file) => file.isTrash);
      case "all":
      default:
        return files.filter((file) => !file.isTrash);
    }
  }, [files, activeTab]);

  // Count files in trash
  const trashCount = useMemo(() => {
    return files.filter((file) => file.isTrash).length;
  }, [files]);

  // Count starred files
  const starredCount = useMemo(() => {
    return files.filter((file) => file.isStarred && !file.isTrash).length;
  }, [files]);

  const handleStarFile = async (fileId: string) => {
    setProcessingFiles(prev => new Set(prev).add(fileId));
    try {
      await axios.patch(`/api/files/${fileId}/star`);

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      toast.success(
        file?.isStarred ? "Removed from Starred" : "Added to Starred",
        {
          description: `"${file?.name}" has been ${
            file?.isStarred ? "removed from" : "added to"
          } your starred files`,
        }
      );
    } catch (error) {
      console.error("Error starring file:", error);
      toast.error("Action Failed", {
        description: "We couldn't update the star status. Please try again.",
      });
    } finally {
      setProcessingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
    }
  };

  const handleTrashFile = async (fileId: string) => {
    setProcessingFiles(prev => new Set(prev).add(fileId));
    try {
      const response = await axios.patch(`/api/files/${fileId}/trash`);
      const responseData = response.data;
      const file = files.find((f) => f.id === fileId);
      const newTrashStatus = responseData.isTrash;

      // Update local state - if it's a folder, also update children recursively
      if (file?.isFolder) {
        // Get all descendant IDs by traversing the local files array
        const getDescendantIds = (parentId: string): string[] => {
          const children = files.filter(f => f.parentId === parentId);
          let ids: string[] = [];
          for (const child of children) {
            ids.push(child.id);
            if (child.isFolder) {
              ids = ids.concat(getDescendantIds(child.id));
            }
          }
          return ids;
        };
        
        const descendantIds = getDescendantIds(fileId);
        const idsToUpdate = new Set([fileId, ...descendantIds]);
        
        setFiles(
          files.map((f) =>
            idsToUpdate.has(f.id) ? { ...f, isTrash: newTrashStatus } : f
          )
        );
      } else {
        // For regular files, just update the single file
        setFiles(
          files.map((f) =>
            f.id === fileId ? { ...f, isTrash: newTrashStatus } : f
          )
        );
      }

      // Show toast
      toast.success(
        newTrashStatus ? "Moved to Trash" : "Restored from Trash",
        {
          description: `"${file?.name}" has been ${
            newTrashStatus ? "moved to trash" : "restored"
          }`,
        }
      );
    } catch (error) {
      console.error("Error trashing file:", error);
      toast.error("Action Failed", {
        description: "We couldn't update the file status. Please try again.",
      });
    } finally {
        setProcessingFiles(prev => {
            const next = new Set(prev);
            next.delete(fileId);
            return next;
        });
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setProcessingFiles(prev => new Set(prev).add(fileId));
    try {
      const fileToDelete = files.find((f) => f.id === fileId);
      const fileName = fileToDelete?.name || "File";

      const response = await axios.delete(`/api/files/${fileId}/delete`);

      if (response.data.success) {
        setFiles(files.filter((file) => file.id !== fileId));
        toast.success("File Permanently Deleted", {
          description: `"${fileName}" has been permanently removed`,
        });
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Deletion Failed", {
        description: "We couldn't delete the file. Please try again later.",
      });
    } finally {
        setProcessingFiles(prev => {
            const next = new Set(prev);
            next.delete(fileId);
            return next;
        });
    }
  };

  const handleEmptyTrash = async () => {
    setIsEmptyingTrash(true);
    try {
      await axios.delete(`/api/files/empty-trash`);
      setFiles(files.filter((file) => !file.isTrash));
      toast.success("Trash Emptied", {
        description: `All ${trashCount} items have been permanently deleted`,
      });
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      toast.error("Action Failed", {
        description: "We couldn't empty the trash. Please try again later.",
      });
    } finally {
      setIsEmptyingTrash(false);
    }
  };

  const handleDownloadFile = async (file: FileType) => {
    try {
      const loadingToastId = toast.loading("Preparing Download", {
        description: `Getting "${file.name}" ready for download...`,
      });

      let blob;

      if (file.type.startsWith("image/")) {
        const downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Failed to download image");
        blob = await response.blob();
      } else {
        const response = await fetch(file.fileUrl);
        if (!response.ok) throw new Error("Failed to download file");
        blob = await response.blob();
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);

      toast.success("Download Ready", {
        id: loadingToastId,
        description: `"${file.name}" is ready to download.`,
      });

      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download Failed", {
        description: "We couldn't download the file. Please try again later.",
      });
    }
  };

  const openImageViewer = (file: FileType) => {
    if (file.type.startsWith("image/")) {
      const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(optimizedUrl, "_blank");
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
    if (onFolderChange) onFolderChange(folderId, folderName);
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      const newFolderId =
        newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      const newFolderName =
        newPath.length > 0 ? newPath[newPath.length - 1].name : null;
      setCurrentFolder(newFolderId);
      if (onFolderChange) onFolderChange(newFolderId, newFolderName);
    }
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);
      if (onFolderChange) onFolderChange(null, null);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      const newFolderId = newPath[newPath.length - 1].id;
      const newFolderName = newPath[newPath.length - 1].name;
      setCurrentFolder(newFolderId);
      if (onFolderChange) onFolderChange(newFolderId, newFolderName);
    }
  };

  const handleItemClick = (file: FileType) => {
    if (file.isFolder) {
      navigateToFolder(file.id, file.name);
    } else if (file.type.startsWith("image/")) {
      openImageViewer(file);
    }
  };

  if (loading) {
    return <FileLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* File Tabs Custom Component */}
      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />

      {/* Navigation Custom Component */}
      {(activeTab === "all" || activeTab === "trash" || activeTab === "starred") && (
        <FolderNavigation
          folderPath={folderPath}
          navigateUp={navigateUp}
          navigateToPathFolder={navigateToPathFolder}
        />
      )}

      {/* Actions Custom Component */}
      <FileActionButtons
        activeTab={activeTab}
        trashCount={trashCount}
        folderPath={folderPath}
        onRefresh={fetchFiles}
        onEmptyTrash={() => setEmptyTrashModalOpen(true)}
        isLoading={loading}
        isEmptyingTrash={isEmptyingTrash}
      />

      <Separator className="my-4" />

      {/* Files Table */}
      {filteredFiles.length === 0 ? (
        <FileEmptyState activeTab={activeTab} />
      ) : (
        <Card className="border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden sm:table-cell">Added</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow
                  key={file.id}
                  className={`transition-colors hover:bg-muted/50 ${
                    file.isFolder || file.type.startsWith("image/")
                      ? "cursor-pointer"
                      : ""
                  }`}
                  onClick={() => handleItemClick(file)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileIcon file={file} />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                            {file.name}
                          </span>
                          
                          <TooltipProvider delayDuration={300}>
                            {file.isStarred && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Star
                                    className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Starred</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {file.isFolder && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Folder</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            
                            {file.type.startsWith("image/") && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Click to view image</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TooltipProvider>
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden mt-1">
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {file.isFolder ? "Folder" : file.type}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">
                      {file.isFolder
                        ? "-"
                        : file.size < 1024
                        ? `${file.size} B`
                        : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(file.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(file.createdAt), "MMMM d, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {/* Assuming FileActions contains a DropdownMenu, it might need refactoring to shadcn as well if it hasn't been done yet */}
                    <FileActions
                      file={file}
                      onStar={handleStarFile}
                      onTrash={handleTrashFile}
                      onDelete={(file) => {
                        setSelectedFile(file);
                        setDeleteModalOpen(true);
                      }}
                      onDownload={handleDownloadFile}
                      isProcessing={processingFiles.has(file.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Permanent Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-medium text-foreground">
                "{selectedFile?.name}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => selectedFile && handleDeleteFile(selectedFile.id)}
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty Trash Confirmation Alert */}
      <AlertDialog open={emptyTrashModalOpen} onOpenChange={setEmptyTrashModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Trash</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to empty the trash? All {trashCount} items
              will be permanently deleted and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleEmptyTrash}
            >
              Empty Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}