"use client";

import { File } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FileEmptyStateProps {
  activeTab: string;
}

export default function FileEmptyState({ activeTab }: FileEmptyStateProps) {
  return (
    <Card className="border-dashed shadow-sm bg-muted/40">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-background rounded-full p-4 mb-4 ring-1 ring-muted">
          <File className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {activeTab === "all" && "No files available"}
          {activeTab === "starred" && "No starred files"}
          {activeTab === "trash" && "Trash is empty"}
        </h3>
        
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {activeTab === "all" &&
            "Upload your first file to get started with your personal cloud storage."}
          {activeTab === "starred" &&
            "Mark important files with a star to find them quickly when you need them."}
          {activeTab === "trash" &&
            "Files you delete will appear here for 30 days before being permanently removed."}
        </p>
      </CardContent>
    </Card>
  );
}