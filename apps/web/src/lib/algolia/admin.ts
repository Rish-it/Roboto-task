import { algoliasearch } from 'algoliasearch';

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);

export const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'blog_posts';
export { client as algoliaClient };