import { NextRequest, NextResponse } from 'next/server';
import { indexBlogPosts } from '@/lib/algolia/indexer';
import { headers } from 'next/headers';

/**
 * API endpoint to reindex blog posts in Algolia
 * Supports both manual triggers and webhook calls from Sanity
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization for webhook calls
    const authHeader = (await headers()).get('authorization');
    const expectedAuth = `Bearer ${process.env.ALGOLIA_ADMIN_API_KEY}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Perform the indexing
    const result = await indexBlogPosts();
    
    if (result.success) {
      return NextResponse.json({ 
        message: `Successfully indexed ${result.count} blog posts`,
        count: result.count 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to index blog posts', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in reindex API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({ 
    message: 'Blog reindex API is healthy',
    timestamp: new Date().toISOString() 
  });
}