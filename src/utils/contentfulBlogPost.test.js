import assert from 'node:assert/strict';
import test from 'node:test';

import { adaptContentfulBlogPost, DEFAULT_BLOG_IMAGE } from './contentfulBlogPost.js';

test('adaptContentfulBlogPost prefers a Contentful hero asset URL', () => {
  const post = adaptContentfulBlogPost({
    fields: {
      slug: 'test-post',
      title: 'Test Post',
      description: 'Description',
      category: 'Tax',
      date: '2026-05-13T09:00:00Z',
      heroImage: { fields: { file: { url: '//images.ctfassets.net/space/image.jpg' } } },
      unsplashPhotoId: 'photo-123',
    },
  });

  assert.equal(post.imageUrl, 'https://images.ctfassets.net/space/image.jpg?w=1400&fm=webp&q=80');
});

test('adaptContentfulBlogPost uses generated Unsplash metadata when no asset is linked', () => {
  const post = adaptContentfulBlogPost({
    fields: {
      slug: 'generated-post',
      title: 'Generated Post',
      unsplashPhotoId: 'photo-1586281380117-5a60ae2050cc',
    },
  });

  assert.equal(
    post.imageUrl,
    'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&w=1400&q=80'
  );
});

test('adaptContentfulBlogPost falls back to a stable default image', () => {
  const post = adaptContentfulBlogPost({ fields: { title: 'Fallback Post' } });

  assert.equal(post.imageUrl, DEFAULT_BLOG_IMAGE);
});
