/**
 * Converts a blog post title to a URL-safe slug.
 * Shared utility used by Blog.tsx, BlogPostPage.tsx, and BlogEditor.tsx.
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

/**
 * Resolves the URL slug for a blog post. Prefers the stored `slug` field
 * (set once and never changed) so editing a post's title later doesn't
 * move or break its URL. Falls back to deriving from the title for posts
 * saved before the `slug` field existed.
 */
export function getPostSlug(post: { slug?: string; title: string }): string {
  return post.slug || slugify(post.title);
}
