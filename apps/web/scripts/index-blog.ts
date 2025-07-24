import 'dotenv/config'
import { client } from '../src/lib/sanity/client'
import { algoliaClient, ALGOLIA_INDEX_NAME } from '../src/lib/algolia/admin'
import { BlogHit } from '../src/types/search'

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
`

async function main() {
  const blogPosts = await client.fetch(BLOG_INDEXING_QUERY)
  const algoliaObjects: BlogHit[] = blogPosts.map((post: any) => ({
    objectID: post._id,
    ...post,
  }))
  await algoliaClient.saveObjects({
    indexName: ALGOLIA_INDEX_NAME,
    objects: algoliaObjects,
  })
  if (process.env.NODE_ENV !== 'production') {
    printSummary(algoliaObjects)
  }
}

function printSummary(blogs: BlogHit[]) {
  console.log(`Indexed ${blogs.length} blogs:\n`)
  blogs.forEach(blog => {
    console.log([
      `Title:        ${blog.title}`,
      `Slug:         ${blog.slug}`,
      `Published:    ${blog.publishedAt ?? '-'}`,
      `Author:       ${blog.author?.name ?? '-'} (${blog.author?.position ?? '-'})`,
      `Category:     ${blog.category?.title ?? '-'}`,
      `Description:  ${blog.description ?? '-'}`,
      `Image:        ${blog.imageUrl ?? '-'}`,
      `Order Rank:   ${blog.orderRank ?? '-'}`,
      `ID:           ${blog._id}`,
      `Type:         ${blog._type}`,
      `----------------------------------------`
    ].join('\n'))
  })
}

main().catch(() => process.exit(1)) 