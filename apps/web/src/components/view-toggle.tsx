"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutGrid, Layers3 } from "lucide-react";

type ViewType = "grid" | "carousel";

interface ViewToggleProps {
  defaultView?: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

export function ViewToggle({ defaultView = "grid", onViewChange, className }: ViewToggleProps) {
  const [currentView, setCurrentView] = useState<ViewType>(defaultView);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    onViewChange(view);
  };

  return (
    <div className={cn("flex items-center bg-muted rounded-lg p-1", className)}>
      <button
        onClick={() => handleViewChange("grid")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
          currentView === "grid"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Grid
      </button>
      
      <button
        onClick={() => handleViewChange("carousel")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
          currentView === "carousel"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Layers3 className="h-4 w-4" />
        Carousel
      </button>
    </div>
  );
}