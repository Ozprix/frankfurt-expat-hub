export const DEFAULT_BLOG_IMAGE =
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80';

const buildContentfulAssetUrl = (fileUrl) => {
  if (!fileUrl) return null;
  const baseUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
  return `${baseUrl}?w=1400&fm=webp&q=80`;
};

const buildUnsplashUrl = (photoId) => {
  if (!photoId) return null;
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1400&q=80`;
};

export const adaptContentfulBlogPost = (entry) => {
  const f = entry?.fields || {};
  const heroImageUrl = buildContentfulAssetUrl(f.heroImage?.fields?.file?.url);
  const unsplashUrl = buildUnsplashUrl(f.unsplashPhotoId);

  return {
    slug: f.slug,
    title: f.title,
    description: f.description,
    category: f.category,
    date: f.date ? f.date.split('T')[0] : new Date().toISOString().split('T')[0],
    readingTime: f.readingTime || '5 min read',
    imageUrl: heroImageUrl || unsplashUrl || DEFAULT_BLOG_IMAGE,
    imageAlt: f.imageAlt || f.title,
    sections: Array.isArray(f.sections) ? f.sections : [],
    links: Array.isArray(f.links) ? f.links : [],
    featured: f.featured === true,
    _source: 'contentful',
  };
};
