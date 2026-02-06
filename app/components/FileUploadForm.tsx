"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Assuming you use Sonner, otherwise use your toast hook
import {
  Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
  File as FileIcon,
  Minimize2,
} from "lucide-react";
import axios from "axios";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
  currentFolderName?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
  currentFolderName = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom file name state
  const [customFileName, setCustomFileName] = useState("");

  // Folder creation state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Oversized image state (for resize option)
  const [oversizedFile, setOversizedFile] = useState<File | null>(null);
  const [resizing, setResizing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = async (selectedFile: File) => {
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please choose a smaller file.");
      setOversizedFile(selectedFile);
      setCustomFileName(selectedFile.name);
      return;
    }

    // Validate image resolution (25 megapixels limit for ImageKit)
    const MAX_MEGAPIXELS = 25;
    try {
      const dimensions = await getImageDimensions(selectedFile);
      const megapixels = (dimensions.width * dimensions.height) / 1_000_000;
      
      if (megapixels > MAX_MEGAPIXELS) {
        setError(
          `Image resolution too high (${megapixels.toFixed(1)} MP). Maximum allowed is ${MAX_MEGAPIXELS} MP.`
        );
        // Store the oversized file so user can choose to resize it
        setOversizedFile(selectedFile);
        setCustomFileName(selectedFile.name);
        return;
      }
    } catch {
      // If we can't read dimensions, we'll let the upload proceed and let ImageKit handle it
      console.warn("Could not validate image dimensions");
    }

    setFile(selectedFile);
    // Set the initial custom file name from the original file name
    setCustomFileName(selectedFile.name);
    setError(null);
  };

  // Helper function to get image dimensions
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
      
      img.src = url;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setOversizedFile(null);
    setCustomFileName("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Resize oversized image and set as file for upload
  const resizeAndUpload = async () => {
    if (!oversizedFile) return;

    setResizing(true);
    setError(null);

    try {
      const MAX_MEGAPIXELS = 25;
      const dimensions = await getImageDimensions(oversizedFile);
      const currentMegapixels = (dimensions.width * dimensions.height) / 1_000_000;
      
      // Calculate scale factor to get under 25MP
      const scaleFactor = Math.sqrt(MAX_MEGAPIXELS / currentMegapixels) * 0.95; // 0.95 for safety margin
      const newWidth = Math.floor(dimensions.width * scaleFactor);
      const newHeight = Math.floor(dimensions.height * scaleFactor);

      // Create canvas and resize
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Load image
      const img = new window.Image();
      const url = URL.createObjectURL(oversizedFile);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load image"));
        };
        img.src = url;
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, oversizedFile.type || "image/jpeg", 0.9);
      });

      if (!blob) {
        throw new Error("Failed to create resized image");
      }

      // Create new file from blob
      const resizedFile = new File([blob], oversizedFile.name, {
        type: blob.type,
      });

      // Check if resized file is still too large (file size)
      if (resizedFile.size > 5 * 1024 * 1024) {
        setError("Resized image still exceeds 5MB. Please use a smaller image.");
        setResizing(false);
        return;
      }

      // Set the resized file for upload
      setFile(resizedFile);
      setOversizedFile(null);
      setError(null);
      
      toast.success("Image Resized", {
        description: `Resized from ${dimensions.width}×${dimensions.height} to ${newWidth}×${newHeight}`,
      });

    } catch (err) {
      console.error("Error resizing image:", err);
      setError("Failed to resize image. Please try a different image.");
    } finally {
      setResizing(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    // Use custom file name if provided, otherwise use original
    const finalFileName = customFileName.trim() || file.name;
    
    const formData = new FormData();
    // Create a new File object with the custom name
    const renamedFile = new File([file], finalFileName, { type: file.type });
    formData.append("file", renamedFile);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      toast.success("Upload Successful", {
        description: `${file.name} has been uploaded successfully.`,
      });

      clearFile();
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      toast.error("Upload Failed", {
        description: "We couldn't upload your file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Invalid Folder Name", {
        description: "Please enter a valid folder name.",
      });
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      toast.success("Folder Created", {
        description: `Folder "${folderName}" has been created successfully.`,
      });

      setFolderName("");
      setFolderModalOpen(false);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Folder Creation Failed", {
        description: "We couldn't create the folder. Please try again.",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2 mb-2">
        <Button
          variant="secondary"
          className="flex-1 gap-2"
          onClick={() => setFolderModalOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
        <Button
          variant="secondary"
          className="flex-1 gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          error
            ? "border-destructive/50 bg-destructive/10"
            : file
            ? "border-primary/50 bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        {!file && !oversizedFile ? (
          <div className="space-y-3">
            <div className="bg-muted w-16 h-16 mx-auto rounded-full flex items-center justify-center">
              <FileUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drag and drop your image here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images up to 5MB
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        ) : (
          (() => {
            const displayFile = file || oversizedFile;
            return (
              <div className="space-y-4">
                {/* File info card */}
                <div className="flex items-center justify-between bg-background p-3 rounded-md border shadow-sm">
                  <div className="flex items-center space-x-3 overflow-hidden flex-1">
                    <div className="p-2 bg-primary/10 rounded-md shrink-0">
                      <FileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left overflow-hidden flex-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        Original: {displayFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {displayFile && displayFile.size < 1024
                          ? `${displayFile.size} B`
                          : displayFile && displayFile.size < 1024 * 1024
                          ? `${(displayFile.size / 1024).toFixed(1)} KB`
                          : displayFile ? `${(displayFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFile}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Editable file name input */}
                <div className="space-y-2">
                  <Label htmlFor="custom-filename" className="text-left block text-sm font-medium">
                    File Name
                  </Label>
                  <Input
                    id="custom-filename"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder="Enter file name..."
                    className="w-full"
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Resize button for oversized files (only for resolution issues, not file size) */}
                {oversizedFile && error && error.includes("resolution") && (
                  <Button
                    onClick={resizeAndUpload}
                    disabled={resizing}
                    variant="secondary"
                    className="w-full gap-2"
                  >
                    {resizing ? (
                      "Resizing..."
                    ) : (
                      <>
                        <Minimize2 className="h-4 w-4" />
                        Upload with Reduced Resolution
                      </>
                    )}
                  </Button>
                )}

                {uploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Only show upload button when we have a valid file (not oversized) */}
                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !!error || !customFileName.trim()}
                    className="w-full gap-2"
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Image
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })()
        )}
      </div>

      {/* Upload tips */}
      <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
        <h4 className="text-sm font-medium mb-2">Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Images are private and only visible to you</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Maximum resolution: 25 megapixels</li>
        </ul>
      </div>

      {/* Create Folder Modal */}
      <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              New Folder
            </DialogTitle>
            <DialogDescription>
              Create a new folder to organize your files.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="My Images"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setFolderModalOpen(false)}
              disabled={creatingFolder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={creatingFolder || !folderName.trim()}
              className="gap-2"
            >
              {creatingFolder ? "Creating..." : "Create Folder"}
              {!creatingFolder && <ArrowRight className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}