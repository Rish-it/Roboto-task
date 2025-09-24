import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  apiVersion: '2025-02-10',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const DEFAULT_CATEGORY = {
  _id: 'default-category',
  _type: 'category',
  title: 'General',
  slug: { current: 'general' },
  description: 'General blog posts and articles',
  color: 'blue',
  featured: false,
  sortOrder: 999,
};

async function createDefaultCategory() {
  try {
    const existingCategory = await client.fetch(
      `*[_type == "category" && _id == $id][0]`,
      { id: DEFAULT_CATEGORY._id }
    );
    
    if (!existingCategory) {
      console.log('Creating default category...');
      await client.create(DEFAULT_CATEGORY);
      console.log('Default category created successfully');
    } else {
      console.log('Default category already exists');
    }
    
    return DEFAULT_CATEGORY._id;
  } catch (error) {
    console.error('Error creating default category:', error);
    throw error;
  }
}

async function migrateBlogsWithoutCategories(defaultCategoryId: string) {
  try {
    // Find blogs without categories
    const blogsWithoutCategories = await client.fetch(`
      *[_type == "blog" && !defined(category)] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log(`Found ${blogsWithoutCategories.length} blogs without categories`);

    if (blogsWithoutCategories.length === 0) {
      console.log('All blogs already have categories');
      return;
    }

    const transaction = client.transaction();
    
    blogsWithoutCategories.forEach((blog: any) => {
      transaction.patch(blog._id, {
        set: {
          category: {
            _type: 'reference',
            _ref: defaultCategoryId
          }
        }
      });
    });

    await transaction.commit();
    console.log(`Successfully updated ${blogsWithoutCategories.length} blogs with default category`);

  } catch (error) {
    console.error('Error migrating blogs:', error);
    throw error;
  }
}

async function verifyMigration() {
  try {
    const blogsWithoutCategories = await client.fetch(`
      count(*[_type == "blog" && !defined(category)])
    `);

    const totalBlogs = await client.fetch(`
      count(*[_type == "blog"])
    `);

    console.log(`Total blogs: ${totalBlogs}`);
    console.log(`Blogs without categories: ${blogsWithoutCategories}`);
    
    if (blogsWithoutCategories === 0) {
      console.log('Migration successful - all blogs now have categories');
    } else {
      console.log('Warning: Some blogs still lack categories');
    }

  } catch (error) {
    console.error('Error verifying migration:', error);
    throw error;
  }
}

async function main() {
  console.log('Starting blog category migration...');

  try {
    const defaultCategoryId = await createDefaultCategory();
    await migrateBlogsWithoutCategories(defaultCategoryId);
    await verifyMigration();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { createDefaultCategory, migrateBlogsWithoutCategories, verifyMigration };