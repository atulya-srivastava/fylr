"use client";

import { Star, Trash, X, ArrowUpFromLine, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
  file: FileType;
  onStar: (id: string) => void;
  onTrash: (id: string) => void;
  onDelete: (file: FileType) => void;
  onDownload: (file: FileType) => void;
  isProcessing?: boolean;
}

export default function FileActions({
  file,
  onStar,
  onTrash,
  onDelete,
  onDownload,
  isProcessing = false,
}: FileActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* Download button */}
      {!file.isTrash && !file.isFolder && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownload(file)}
          disabled={isProcessing}
          className="h-8 px-2 lg:px-3"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      )}

      {/* Star button */}
      {!file.isTrash && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onStar(file.id)}
          disabled={isProcessing}
          className="h-8 px-2 lg:px-3"
        >
          <Star
            className={`h-4 w-4 sm:mr-2 ${
              file.isStarred
                ? "text-yellow-400 fill-current"
                : "text-muted-foreground"
            }`}
          />
          <span className="hidden sm:inline">
            {file.isStarred ? "Unstar" : "Star"}
          </span>
        </Button>
      )}

      {/* Trash/Restore button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onTrash(file.id)}
        disabled={isProcessing}
        className={`h-8 px-2 lg:px-3 ${
          file.isTrash ? "text-green-600 hover:text-green-700" : ""
        }`}
      >
        {file.isTrash ? (
          <ArrowUpFromLine className="h-4 w-4 sm:mr-2" />
        ) : (
          <Trash className="h-4 w-4 sm:mr-2" />
        )}
        <span className="hidden sm:inline">
          {file.isTrash ? "Restore" : "Delete"}
        </span>
      </Button>

      {/* Delete permanently button */}
      {file.isTrash && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(file)}
          disabled={isProcessing}
          className="h-8 px-2 lg:px-3"
        >
          <X className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      )}
    </div>
  );
}