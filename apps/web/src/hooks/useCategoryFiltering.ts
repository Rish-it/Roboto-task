import { useMemo } from "react";

import type { CategoryData } from "@/utils/categoryUtils";

interface UseCategoryFilteringProps {
  categories: CategoryData[];
  maxDisplay?: number;
}

interface CategoryFilteringResult {
  displayCategories: CategoryData[];
  hasMoreCategories: boolean;
  featuredCount: number;
  totalCount: number;
}

export function useCategoryFiltering({ 
  categories, 
  maxDisplay = 6 
}: UseCategoryFilteringProps): CategoryFilteringResult {
  return useMemo(() => {
    if (!categories?.length) {
      return {
        displayCategories: [],
        hasMoreCategories: false,
        featuredCount: 0,
        totalCount: 0,
      };
    }

    const featuredCategories = categories.filter(cat => cat.featured);
    const remainingCategories = categories.filter(cat => !cat.featured);
    
    const displayCategories = [
      ...featuredCategories,
      ...remainingCategories.slice(0, Math.max(0, maxDisplay - featuredCategories.length))
    ];

    return {
      displayCategories,
      hasMoreCategories: categories.length > maxDisplay,
      featuredCount: featuredCategories.length,
      totalCount: categories.length,
    };
  }, [categories, maxDisplay]);
} 