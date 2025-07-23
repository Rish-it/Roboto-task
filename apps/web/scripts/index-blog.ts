import 'dotenv/config';
import { indexBlogPosts } from '../src/lib/algolia/indexer';

async function main() {
  console.log('Starting blog indexing...');
  
  // Log environment variables to debug
  console.log('Sanity Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('Algolia App ID:', process.env.NEXT_PUBLIC_ALGOLIA_APP_ID);
  console.log('Algolia Index Name:', process.env.ALGOLIA_INDEX_NAME);
  
  const result = await indexBlogPosts();
  
  if (result.success) {
    console.log(`✅ Successfully indexed ${result.count} blog posts`);
  } else {
    console.error('❌ Failed to index blog posts:', result.error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});