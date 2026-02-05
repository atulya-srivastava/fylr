"use client";

import { ArrowUpFromLine, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; 

interface FolderNavigationProps {
  folderPath: Array<{ id: string; name: string }>;
  navigateUp: () => void;
  navigateToPathFolder: (index: number) => void;
}

export default function FolderNavigation({
  folderPath,
  navigateUp,
  navigateToPathFolder,
}: FolderNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm overflow-x-auto pb-2 mask-linear-fade">
      {/* Go Up Button */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 mr-1 shrink-0"
        onClick={navigateUp}
        disabled={folderPath.length === 0}
        title="Go up one level"
      >
        <ArrowUpFromLine className="h-4 w-4" />
      </Button>

      {/* Root/Home Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateToPathFolder(-1)}
        className={cn(
          "h-8 px-2 gap-2 text-muted-foreground hover:text-foreground transition-colors",
          folderPath.length === 0 && "bg-muted font-medium text-foreground pointer-events-none"
        )}
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </Button>

      {/* Breadcrumb Path */}
      {folderPath.map((folder, index) => {
        const isLast = index === folderPath.length - 1;
        
        return (
          <div key={folder.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0 mx-0.5" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToPathFolder(index)}
              className={cn(
                "h-8 px-2 max-w-[150px] truncate",
                isLast 
                  ? "bg-muted font-medium text-foreground pointer-events-none" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={folder.name}
            >
              <span className="truncate">{folder.name}</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}