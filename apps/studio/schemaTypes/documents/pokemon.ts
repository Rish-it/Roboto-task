import { Gamepad2 } from "lucide-react";
import { defineField, defineType } from "sanity";
import { PokemonSearchInput } from "../../components/pokemonSearchInput";

export const pokemon = defineType({
  name: "pokemon",
  title: "Pokemon",
  type: "object",
  icon: Gamepad2,
  description: "A Pokemon with data fetched from PokeAPI",
  components: {
    input: PokemonSearchInput,
  },
  fields: [
    defineField({
      name: "id",
      type: "number",
      title: "Pokemon ID",
      description: "The unique ID of the Pokemon from PokeAPI",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Pokemon Name",
      description: "The name of the Pokemon",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "types",
      type: "array",
      title: "Pokemon Types",
      description: "The types of the Pokemon (e.g., Fire, Water, Electric)",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "spriteUrl",
      type: "url",
      title: "Sprite URL",
      description: "The URL of the Pokemon's official artwork or sprite",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "height",
      type: "number",
      title: "Height",
      description: "The height of the Pokemon in decimeters",
    }),
    defineField({
      name: "weight",
      type: "number",
      title: "Weight",
      description: "The weight of the Pokemon in hectograms",
    }),
  ],
  preview: {
    select: {
      title: "name",
      id: "id",
      types: "types",
      spriteUrl: "spriteUrl",
    },
    prepare: ({ title, id, types, spriteUrl }) => {
      const typesString = types?.join(", ") || "Unknown";
      return {
        title: `${title} (#${id})`,
        subtitle: `Types: ${typesString}`,
        media: spriteUrl,
      };
    },
  },
}); 