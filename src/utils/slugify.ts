/**
 * Converts a blog post title to a URL-safe slug.
 * Shared utility used by Blog.tsx and BlogPostPage.tsx.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[®©™]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
