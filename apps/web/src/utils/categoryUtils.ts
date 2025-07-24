import * as LucideIcons from "lucide-react";

export type CategoryColor = 
  | "blue" 
  | "green" 
  | "purple" 
  | "red" 
  | "orange" 
  | "yellow" 
  | "pink" 
  | "gray";

export type CategorySize = "small" | "medium" | "large";

export interface CategoryData {
  _id: string;
  title: string;
  slug: string;
  color: CategoryColor;
  icon?: string;
  featured: boolean;
  postCount: number;
}

export const categoryColorVariants: Record<CategoryColor, string> = {
  blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:hover:bg-blue-900",
  green: "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:hover:bg-green-900", 
  purple: "bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:border-purple-800 dark:hover:bg-purple-900",
  red: "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:hover:bg-red-900",
  orange: "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-800 dark:hover:bg-orange-900",
  yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-800 dark:hover:bg-yellow-900",
  pink: "bg-pink-50 border-pink-200 hover:bg-pink-100 dark:bg-pink-950 dark:border-pink-800 dark:hover:bg-pink-900",
  gray: "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-800 dark:hover:bg-gray-900",
} as const;

export const categorySizeVariants: Record<CategorySize, string> = {
  small: "text-xs px-2.5 py-1 rounded-full",
  medium: "text-sm px-3 py-1.5 rounded-full", 
  large: "text-base px-4 py-2 rounded-full",
} as const;

export const categoryIconSizes: Record<CategorySize, string> = {
  small: "h-3 w-3",
  medium: "h-4 w-4",
  large: "h-5 w-5", 
} as const;

export function getCategoryIcon(iconName?: string) {
  if (!iconName || !(iconName in LucideIcons)) {
    return null;
  }
  
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
  return IconComponent as React.ComponentType<{ className?: string }>;
}

export function getCategoryColorClass(color: CategoryColor): string {
  return categoryColorVariants[color] || categoryColorVariants.blue;
}

export function getCategorySizeClass(size: CategorySize): string {
  return categorySizeVariants[size];
}

export function getCategoryIconSize(size: CategorySize): string {
  return categoryIconSizes[size];
} 