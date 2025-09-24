import { client } from '@/lib/sanity/client';
import { algoliaClient, ALGOLIA_INDEX_NAME } from './admin';

// Query to get all blog posts for indexing
const BLOG_INDEXING_QUERY = `
  *[_type == "blog" && (seoHideFromLists != true)] {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    publishedAt,
    orderRank,
    "author": authors[0]->{
      name,
      position
    },
    "category": category->{
      _id,
      title,
      "slug": slug.current,
      color,
      icon
    },
    "content": array::join(string::split(array::join(richText[].children[].text, " "), ""), " "),
    "imageUrl": image.asset->url
  }
`;

interface BlogPost {
  objectID: string;
  _id: string;
  _type: string;
  title: string;
  description?: string;
  slug: string;
  publishedAt?: string;
  orderRank?: string;
  author?: {
    name: string;
    position?: string;
  };
  category?: {
    _id: string;
    title: string;
    slug: string;
    color: string;
    icon?: string;
  };
  content: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export async function indexBlogPosts() {
  try {
    console.log('Fetching blog posts from Sanity...');
    const blogPosts = await client.fetch(BLOG_INDEXING_QUERY);
    
    if (!blogPosts || blogPosts.length === 0) {
      console.log('No blog posts found to index');
      return { success: true, count: 0 };
    }
    
    // Transform data for Algolia
    const algoliaObjects: BlogPost[] = blogPosts.map((post: any) => ({
      objectID: post._id,
      _id: post._id,
      _type: post._type,
      title: post.title,
      description: post.description || '',
      slug: post.slug,
      publishedAt: post.publishedAt,
      orderRank: post.orderRank,
      author: post.author,
      category: post.category,
      content: post.content || '',
      imageUrl: post.imageUrl,
      // Add searchable content combining title, description, and content
      _searchableContent: [
        post.title,
        post.description,
        post.content,
        post.author?.name,
        post.category?.title
      ].filter(Boolean).join(' ').toLowerCase(),
    }));

    console.log(`Indexing ${algoliaObjects.length} blog posts...`);
    
    // Configure search settings
    await configureSearchSettings();
    
    // Index to Algolia using v5 API
    await algoliaClient.saveObjects({ 
      indexName: ALGOLIA_INDEX_NAME,
      objects: algoliaObjects 
    });
    
    console.log(`Successfully indexed ${algoliaObjects.length} blog posts`);
    return { success: true, count: algoliaObjects.length };
  } catch (error) {
    console.error('Error indexing blog posts:', error);
    return { success: false, error };
  }
}

// Configure search settings for optimal search experience
async function configureSearchSettings() {
  try {
    await algoliaClient.setSettings({
      indexName: ALGOLIA_INDEX_NAME,
      indexSettings: {
        // Attributes to search in
        searchableAttributes: [
          'title',
          'description', 
          'content',
          '_searchableContent',
          'author.name',
          'category.title'
        ],
        // Attributes for faceting/filtering
        attributesForFaceting: [
          'category.title',
          'category.slug',
          'author.name'
        ],
        // Custom ranking
        customRanking: [
          'desc(publishedAt)',
          'asc(orderRank)'
        ],
        // Highlight configuration
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
        // Snippet configuration
        attributesToSnippet: [
          'description:150',
          'content:200'
        ],
        // Distinct configuration
        attributeForDistinct: '_id',
        distinct: true
      }
    });
    
    console.log('Search settings configured successfully');
  } catch (error) {
    console.warn('Failed to configure search settings:', error);
  }
}
