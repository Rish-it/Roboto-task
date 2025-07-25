import { algoliasearch } from "algoliasearch";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;

export const searchClient = algoliasearch(appId, apiKey);
export const ALGOLIA_INDEX_NAME = 
  process.env.ALGOLIA_INDEX_NAME || "blog_posts";