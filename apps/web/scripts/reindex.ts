#!/usr/bin/env tsx

import 'dotenv/config';
import { indexBlogPosts } from '../src/lib/algolia/indexer';

async function main() {
  console.log('Starting blog reindexing process...');
  
  try {
    const result = await indexBlogPosts();
    
    if (result.success) {
      console.log(`Successfully indexed ${result.count} blog posts`);
    } else {
      console.error('Failed to index blog posts:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error during indexing:', error);
    process.exit(1);
  }
}

main();