// apps/web/scripts/setup-algolia.ts
import 'dotenv/config';
import { algoliaClient, ALGOLIA_INDEX_NAME } from '../src/lib/algolia/admin';

async function setupAlgoliaIndex() {
  try {
    console.log('Setting up Algolia index:', ALGOLIA_INDEX_NAME);
    
    await algoliaClient.setSettings({
      indexName: ALGOLIA_INDEX_NAME,
      indexSettings: {
        searchableAttributes: [
          'title',
          'description', 
          'content',
          'author.name'
        ],
        attributesForFaceting: [
          'author.name',
          'publishedAt'
        ],
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ],
        customRanking: ['desc(publishedAt)'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      }
    });
    
    console.log('Algolia index configured successfully');
  } catch (error) {
    console.error('Error configuring Algolia index:', error);
    process.exit(1);
  }
}

setupAlgoliaIndex();