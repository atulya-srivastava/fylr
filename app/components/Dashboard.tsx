"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileUp, FileText, User, ChevronLeft, ChevronRight } from "lucide-react";

// Components
import FileUploadForm from "@/app/components/FileUploadForm";
import FileList from "@/app/components/FileList";
import UserProfile from "@/app/components/UserProfile";

// shadcn/ui imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"files" | "profile">("files");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);
  const [isUploadCollapsed, setIsUploadCollapsed] = useState(false);

  // Sync state with URL parameter if present
  useEffect(() => {
    if (tabParam === "files" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null, folderName: string | null) => {
    setCurrentFolder(folderId);
    setCurrentFolderName(folderName);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold tracking-tight">
          Hi,{" "}
          <span className="text-primary">
            {userName?.length > 10
              ? `${userName.substring(0, 10)}...`
              : userName?.split(" ")[0] || "there"}
          </span>
          !
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Your images are waiting for you.
        </p>
      </div>

      {/* Tabs System */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "files" | "profile")}
        className="w-full"
      >
        <div className="border-b pb-0 mb-8">
          <TabsList className="bg-transparent p-0 h-auto gap-6">
            <TabsTrigger
              value="files"
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground transition-all gap-2"
            >
              <FileText className="h-4 w-4" />
              My Files
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground transition-all gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Files Tab Content */}
        <TabsContent value="files" className="mt-0 border-0 outline-none">
          <div className="flex gap-6">
            {/* Upload Section - Collapsible */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isUploadCollapsed ? "w-12" : "w-80 lg:w-96"
              } shrink-0`}
            >
              <Card>
                {isUploadCollapsed ? (
                  // Collapsed state - just show expand button
                  <div className="flex flex-col items-center py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsUploadCollapsed(false)}
                      className="h-10 w-10"
                      title="Expand upload panel"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="mt-4 -rotate-90 whitespace-nowrap text-sm font-medium text-muted-foreground">
                      Upload
                    </div>
                  </div>
                ) : (
                  // Expanded state
                  <>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FileUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">
                            Upload
                          </CardTitle>
                          {currentFolderName && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              to <span className="font-medium text-foreground">{currentFolderName}</span>
                            </p>
                          )}
                          {!currentFolderName && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              to <span className="font-medium text-foreground">Home</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsUploadCollapsed(true)}
                        className="h-8 w-8"
                        title="Collapse upload panel"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <FileUploadForm
                        userId={userId}
                        onUploadSuccess={handleFileUploadSuccess}
                        currentFolder={currentFolder}
                        currentFolderName={currentFolderName}
                      />
                    </CardContent>
                  </>
                )}
              </Card>
            </div>

            {/* File List Section - Takes remaining space */}
            <div className="flex-1 min-w-0">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    Your Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <FileList
                    userId={userId}
                    refreshTrigger={refreshTrigger}
                    onFolderChange={handleFolderChange}
                  /> 
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Profile Tab Content */}
        <TabsContent value="profile" className="mt-8 border-0 outline-none">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}