"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Hash } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { 
  type CategoryData,
  getCategoryIcon
} from "@/utils/categoryUtils";

interface SearchCategoryBarProps {
  categories: CategoryData[];
  activeCategory?: string;
  className?: string;
}

export function SearchCategoryBar({ 
  categories, 
  activeCategory,
  className 
}: SearchCategoryBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories.sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
    }

    return categories
      .filter((category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0));
  }, [categories, searchQuery]);

  const activeCategoryData = categories.find(cat => cat.slug === activeCategory);

  const handleCategorySelect = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          Browse categories:
        </span>
        
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 px-3 rounded-full justify-between gap-2 min-w-[140px] text-sm",
                "hover:bg-accent hover:text-accent-foreground",
                "border-border/40 hover:border-border/60",
                "transition-all duration-200 shadow-sm hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-1.5 truncate">
                {activeCategoryData ? (
                  <>
                    {(() => {
                      const IconComponent = getCategoryIcon(activeCategoryData.icon || undefined);
                      return IconComponent ? (
                        <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                      );
                    })()}
                    <span className="truncate text-xs font-medium">{activeCategoryData.title}</span>
                    <span className="text-[10px] opacity-75 bg-muted px-1 py-0.5 rounded-full">
                      {activeCategoryData.postCount}
                    </span>
                  </>
                ) : (
                  <>
                    <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium">All categories</span>
                  </>
                )}
              </div>
              <ChevronDown className={cn(
                "h-3 w-3 flex-shrink-0 transition-transform duration-200 opacity-50",
                isOpen && "rotate-180"
              )} />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-56 p-1 rounded-xl shadow-lg border-border/50" 
            align="start"
            sideOffset={4}
          >
            <div className="max-h-64 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {
                  const IconComponent = getCategoryIcon(category.icon || undefined);
                  const colorClass = "bg-neutral-100 text-neutral-900 hover:bg-neutral-200";
                  const isActive = activeCategory === category.slug;

                  return (
                    <DropdownMenuItem key={category._id} asChild>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        onClick={handleCategorySelect}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-lg text-sm",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground",
                          "transition-colors duration-150",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium flex-shrink-0",
                          colorClass
                        )}>
                          {IconComponent ? (
                            <IconComponent className="h-3 w-3" />
                          ) : (
                            <Hash className="h-3 w-3 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate text-sm">{category.title}</span>
                            <span className="text-xs text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                              {category.postCount}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="px-3 py-6 text-center">
                  <Hash className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No categories found" : "No categories available"}
                  </p>
                </div>
              )}
            </div>
            
            {categories.length > 0 && (
              <div className="pt-1 border-t border-border/30 mt-1">
                <Link
                  href="/blog/categories"
                  onClick={handleCategorySelect}
                  className="flex items-center justify-center w-full px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                >
                  View all categories
                </Link>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}
