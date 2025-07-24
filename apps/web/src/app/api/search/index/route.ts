import { NextRequest, NextResponse } from 'next/server';
import { indexBlogPosts } from '@/lib/algolia/indexer';

export async function POST(request: NextRequest) {
  try {
    // Add simple authentication check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ALGOLIA_ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await indexBlogPosts();
    
    if (result.success) {
      return NextResponse.json({ 
        message: `Successfully indexed ${result.count} blog posts` 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to index blog posts', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}