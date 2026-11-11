import directory from '@/data/scraped/directory.json';
import { directoryCategories } from '@/data/directoryCategories';

export const providerSlug = (provider) =>
  `${provider.category || 'provider'}-${provider.name || 'listing'}`
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getProviderBySlug = (slug) =>
  (Array.isArray(directory) ? directory : []).find((provider) => providerSlug(provider) === slug);

export const getProviderCategoryId = (provider) =>
  directoryCategories.find((category) => category.title === provider.category)?.id || '';
