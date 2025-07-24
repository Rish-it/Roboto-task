import { TagIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";

// Custom slugify for categories (no leading slash)
const categorySlugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  groups: GROUPS,
  description:
    "Create categories to organize your blog posts. Each category can have its own description, icon, and SEO settings.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Category Name",
      description: "The name of the category (e.g., 'Sanity', 'Next.js', 'React')",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Category name is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description:
        "A brief description of what this category is about. This helps with SEO and user understanding.",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      validation: (rule) => [
        rule
          .min(100)
          .warning(
            "Category description should be at least 100 characters for better SEO",
          ),
        rule
          .max(160)
          .warning(
            "Category description should not exceed 160 characters for optimal search results",
          ),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL Slug",
      description:
        "The URL-friendly version of the category name (e.g., 'sanity', 'nextjs')",
      group: GROUP.MAIN_CONTENT,
      // Removed PathnameFieldComponent for categories
      options: {
        source: "title",
        slugify: categorySlugify,
        isUnique,
      },
      validation: (Rule) => [
        Rule.required().error("A URL slug is required"),
        Rule.custom((value, context) => {
          if (!value?.current) return true;
          // Ensure the slug doesn't start with /blog/ or /
          if (value.current.startsWith("/")) {
            return 'Slug should not start with a "/". Use only lowercase letters, numbers, and hyphens.';
          }
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)) {
            return 'Slug should only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: "color",
      type: "string",
      title: "Category Color",
      description: "Choose a color for this category (used in badges and UI)",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Purple", value: "purple" },
          { title: "Red", value: "red" },
          { title: "Orange", value: "orange" },
          { title: "Yellow", value: "yellow" },
          { title: "Pink", value: "pink" },
          { title: "Gray", value: "gray" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "blue",
    }),
    defineField({
      name: "icon",
      type: "string",
      title: "Icon Name",
      description: "Optional: Lucide icon name for this category (e.g., 'Code', 'Palette', 'Zap')",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Category",
      description: "Featured categories will be highlighted in navigation",
      group: GROUP.MAIN_CONTENT,
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      type: "number",
      title: "Sort Order",
      description: "Lower numbers appear first in category lists",
      group: GROUP.MAIN_CONTENT,
      initialValue: 100,
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      slug: "slug.current",
      color: "color",
      featured: "featured",
      isPrivate: "seoNoIndex",
    },
    prepare: ({ title, description, slug, color, featured, isPrivate }) => {
      const visibility = isPrivate ? "🔒 Private" : "🌎 Public";
      const featuredBadge = featured ? "⭐ Featured" : "";
      const colorBadge = color ? `🎨 ${color}` : "";
      
      return {
        title: title || "Untitled Category",
        subtitle: `${visibility} | ${featuredBadge} ${colorBadge} | 🔗 /blog/${slug || "no-slug"}`,
        media: TagIcon,
      };
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "sortOrder", direction: "asc" },
      ],
    },
  ],
}); 