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
    
    // Transform data for Algolia
    const algoliaObjects: BlogPost[] = blogPosts.map((post: any) => ({
      objectID: post._id,
      ...post,
      // Extract plain text from rich text for better searchability
      content: extractTextFromRichText(post.richText),
    }));

    console.log(`Indexing ${algoliaObjects.length} blog posts...`);
    
    // Index to Algolia using v5 API
    const response = await algoliaClient.saveObjects({ 
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

// Helper function to extract plain text from rich text
function extractTextFromRichText(richText: any[]): string {
  if (!richText) return '';
  
  return richText
    .filter(block => block._type === 'block')
    .map(block => 
      block.children
        ?.filter((child: any) => child._type === 'span')
        .map((child: any) => child.text)
        .join(' ')
    )
    .filter(Boolean)
    .join(' ');
}
