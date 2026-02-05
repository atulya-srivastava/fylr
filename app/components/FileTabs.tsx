"use client";

import { useRef, useEffect, useState } from "react";
import { File, Star, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { File as FileType } from "@/lib/db/schema";

interface FileTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  files: FileType[];
  starredCount: number;
  trashCount: number;
}

const tabs = [
  { key: "all", label: "All Files", icon: File },
  { key: "starred", label: "Starred", icon: Star },
  { key: "trash", label: "Trash", icon: Trash },
];

export default function FileTabs({
  activeTab,
  onTabChange,
  files,
  starredCount,
  trashCount,
}: FileTabsProps) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  const getCount = (key: string) => {
    switch (key) {
      case "all":
        return files.filter((file) => !file.isTrash).length;
      case "starred":
        return starredCount;
      case "trash":
        return trashCount;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
    const activeTabElement = tabsRef.current[activeIndex];
    const container = containerRef.current;

    if (activeTabElement && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();
      
      setSliderStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [activeTab]);

  return (
    <div className="relative flex justify-between  w-full" ref={containerRef}>
      {/* Sliding background indicator */}
      <div
        className="absolute h-3/4 top-1/2 -translate-y-1/2 bg-primary/10 rounded-lg transition-all duration-300 ease-out"
        style={{
          left: sliderStyle.left,
          width: sliderStyle.width,
        }}
      />
      
      {/* Tab buttons */}
      <div className="relative justify-between flex gap-3 p-1.5 w-full bg-muted/50 rounded-lg">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = getCount(tab.key);
          
          return (
            <button
              key={tab.key}
              ref={(el) => { tabsRef.current[index] = el; }}
              onClick={() => onTabChange(tab.key)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-md
                font-medium text-sm transition-all duration-200
                ${isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }
              `}
            >
              <Icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? "text-primary" : ""}`} />
              <span>{tab.label}</span>
              <Badge 
                variant={tab.key === "trash" && isActive ? "destructive" : isActive ? "default" : "secondary"} 
                className="ml-1 rounded-sm px-1.5 min-w-[1.25rem] text-xs"
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}