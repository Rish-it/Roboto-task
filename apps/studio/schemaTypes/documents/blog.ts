import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { FileTextIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";

export const blog = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: FileTextIcon,
  groups: GROUPS,
  orderings: [orderRankOrdering],
  description: "Blog post content management",
  fields: [
    orderRankField({ type: "blog" }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Blog post title",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A blog title is required"),
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
      rows: 3,
      description: "Blog post summary for SEO",
      group: GROUP.MAIN_CONTENT,
      validation: (rule) => [
        rule.min(140).warning("Description should be at least 140 characters for SEO"),
        rule.max(160).warning("Description should not exceed 160 characters"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description: "URL slug for the blog post",
      group: GROUP.MAIN_CONTENT,
      components: {
        field: PathnameFieldComponent,
      },
      options: {
        source: "title",
        slugify: createSlug,
        isUnique,
      },
      validation: (Rule) => Rule.required().error("A URL slug is required"),
    }),
    defineField({
      name: "authors",
      type: "array",
      title: "Authors",
      description: "Blog post author",
      of: [
        defineArrayMember({
          type: "reference",
          to: [
            {
              type: "author",
              options: {
                disableNew: true,
              },
            },
          ],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => [
        Rule.required(),
        Rule.max(1),
        Rule.min(1),
        Rule.unique(),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "category",
      type: "reference",
      title: "Category",
      description: "Blog post category",
      to: [
        {
          type: "category",
          options: {
            disableNew: true,
          },
        },
      ],
      options: {
        disableNew: true,
      },
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Please select a category for this blog post"),
    }),
    defineField({
      name: "publishedAt",
      type: "date",
      initialValue: () => new Date().toISOString().split("T")[0],
      title: "Published At",
      description: "Publication date",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "image",
      title: "Image",
      description: "Featured image for the blog post",
      type: "image",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "richText",
      type: "richText",
      description: "Main blog post content",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "pokemon",
      type: "pokemon",
      title: "Featured Pokemon",
      description: "Optional featured Pokemon",
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      isPrivate: "seoNoIndex",
      isHidden: "seoHideFromLists",
      slug: "slug.current",
      author: "authors.0.name",
      publishDate: "publishedAt",
      categoryTitle: "category.title",
      categoryColor: "category.color",
    },
    prepare: ({
      title,
      media,
      isPrivate,
      isHidden,
      author,
      publishDate,
      categoryTitle,
    }) => {
      const visibility = isPrivate ? "Private" : isHidden ? "Hidden" : "Public";
      const authorInfo = author || "No author";
      const dateInfo = publishDate ? new Date(publishDate).toLocaleDateString() : "Draft";
      const categoryInfo = categoryTitle || "No category";

      return {
        title: title || "Untitled Blog",
        media,
        subtitle: `${visibility} | ${categoryInfo} | ${authorInfo} | ${dateInfo}`,
      };
    },
  },
});
