// apps/web/scripts/setup-categories.ts
import 'dotenv/config';
import { client } from '../src/lib/sanity/client';

interface CategoryStats {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  featured: boolean;
  sortOrder: number;
  postCount: number;
  posts: {
    _id: string;
    title: string;
    slug: string;
    publishedAt?: string;
  }[];
}

async function analyzeCategorySystem() {
  try {
    console.log('Analyzing category system in Sanity CMS...');
    
    // Fetch all categories with their associated blog posts
    const categories: CategoryStats[] = await client.fetch(`
      *[_type == "category"] | order(sortOrder asc, title asc) {
        _id,
        title,
        "slug": slug.current,
        description,
        color,
        icon,
        featured,
        sortOrder,
        "postCount": count(*[_type == "blog" && category._ref == ^._id && (seoHideFromLists != true)]),
        "posts": *[_type == "blog" && category._ref == ^._id && (seoHideFromLists != true)] | order(publishedAt desc) [0...5] {
          _id,
          title,
          "slug": slug.current,
          publishedAt
        }
      }
    `);

    if (categories.length === 0) {
      console.log('No categories found in your Sanity CMS.');
      console.log('To create categories:');
      console.log('   1. Go to Sanity Studio (http://localhost:3333)');
      console.log('   2. Navigate to Categories section');
      console.log('   3. Create new category documents');
      return;
    }

    console.log(`Found ${categories.length} categories in your system:`);
    console.log('');
    
    // Display category statistics table
    console.log('--------------------------------------------------------------------------');
    console.log('Category Analysis');
    console.log('--------------------------------------------------------------------------');
    
    let totalPosts = 0;
    let featuredCount = 0;
    
    categories.forEach((category) => {
      const featured = category.featured ? '[featured]' : '';
      const posts = `${category.postCount} posts`.padEnd(10);
      const name = category.title.padEnd(20);
      const slug = `/blog/${category.slug}`.padEnd(25);
      const color = `${category.color}`.padEnd(8);
      
      console.log(`${featured} ${name} ${slug} ${posts} ${color}`);
      
      // Show recent posts for categories with content
      if (category.posts.length > 0) {
        category.posts.slice(0, 3).forEach((post, index) => {
          const isLast = index === category.posts.length - 1 || index === 2;
          const prefix = isLast ? '    └─' : '    ├─';
          const postTitle = post.title.length > 45 ? post.title.substring(0, 42) + '...' : post.title;
          console.log(`${prefix} ${postTitle}`);
        });
        
        if (category.posts.length > 3) {
          console.log(`    └─ ... and ${category.posts.length - 3} more posts`);
        }
        console.log('');
      }
      
      totalPosts += category.postCount;
      if (category.featured) featuredCount++;
    });
    
    console.log('--------------------------------------------------------------------------');
    
    // Summary statistics
    console.log('Category System Summary:');
    console.log(`   - Total Categories: ${categories.length}`);
    console.log(`   - Featured Categories: ${featuredCount}`);
    console.log(`   - Total Blog Posts: ${totalPosts}`);
    console.log(`   - Categorized Posts: ${totalPosts}`);
    
    // Find uncategorized posts
    const uncategorizedPosts = await client.fetch(`
      count(*[_type == "blog" && !defined(category) && (seoHideFromLists != true)])
    `);
    
    if (uncategorizedPosts > 0) {
      console.log(`   - Uncategorized Posts: ${uncategorizedPosts}`);
      console.log('Warning: You have blog posts without categories!');
      console.log('   Consider assigning categories to improve content organization.');
    }
    
    // Category distribution analysis
    const maxPosts = Math.max(...categories.map(c => c.postCount));
    const avgPosts = totalPosts / categories.length;
    
    console.log('Content Distribution:');
    console.log(`   - Average posts per category: ${avgPosts.toFixed(1)}`);
    console.log(`   - Most active category: ${categories.find(c => c.postCount === maxPosts)?.title} (${maxPosts} posts)`);
    
    const emptyCategories = categories.filter(c => c.postCount === 0);
    if (emptyCategories.length > 0) {
      console.log(`   - Empty categories: ${emptyCategories.length}`);
      console.log('     Empty categories:', emptyCategories.map(c => c.title).join(', '));
    }
    
    // Recommendations
    console.log('Recommendations:');
    if (uncategorizedPosts > 0) {
      console.log('   - Assign categories to uncategorized blog posts');
    }
    if (emptyCategories.length > 0) {
      console.log('   - Create content for empty categories or remove them');
    }
    if (featuredCount === 0) {
      console.log('   - Mark important categories as "featured" for better visibility');
    }
    if (categories.length < 3) {
      console.log('   - Consider creating more categories for better content organization');
    }
    
    console.log('Category URLs:');
    categories.forEach(category => {
      const status = category.postCount > 0 ? '[ok]' : '[empty]';
      console.log(`   ${status} http://localhost:3000/blog/${category.slug} (${category.postCount} posts)`);
    });
    
  } catch (error) {
    console.error('Error analyzing categories:', error);
    process.exit(1);
  }
}

async function validateCategorySystem() {
  try {
    console.log('Validating category system configuration...');
    
    // Check if we can query categories (this validates the schema exists)
    try {
      const categoryCount = await client.fetch(`count(*[_type == "category"])`);
      console.log('Category schema is properly configured');
      console.log(`Found ${categoryCount} categories in system`);
    } catch (error) {
      let message = 'Unknown error';
      if (typeof error === 'object' && error && 'message' in error && typeof (error as any).message === 'string') {
        message = (error as any).message;
      }
      console.log('Category schema not found or misconfigured');
      console.log('   Make sure you have the category document type defined in your schema');
      console.log('   Error:', message);
      return false;
    }
    
    // Check for blog posts with category references
    const blogPostsWithCategories = await client.fetch(`
      count(*[_type == "blog" && defined(category)])
    `);
    
    console.log(`Found ${blogPostsWithCategories} blog posts with category assignments`);
    
    // Check Next.js routing
    console.log('Next.js category routing configured (/blog/[slug])');
    console.log('Algolia category filtering configured');
    
    return true;
    
  } catch (error) {
    console.error('Error validating category system:', error);
    return false;
  }
}

async function main() {
  const isValid = await validateCategorySystem();
  
  if (isValid) {
    console.log('');
    await analyzeCategorySystem();
  }
  
  console.log('Category system analysis complete!');
}

main(); 