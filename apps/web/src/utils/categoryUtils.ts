import * as LucideIcons from "lucide-react";

export interface CategoryData {
  _id: string;
  title: string;
  description?: string | null;
  slug: string;
  icon?: string | null;
  featured: boolean | null;
  sortOrder?: number | null;
  postCount: number;
}

export function getCategoryIcon(iconName?: string) {
  if (!iconName || !(iconName in LucideIcons)) {
    return null;
  }
  
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
  return IconComponent as React.ComponentType<{ className?: string }>;
}

 