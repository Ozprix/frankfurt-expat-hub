
export const formatPrice = (price, currency = 'EUR') => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(price);
};

export const calculatePricePerSqm = (price, size) => {
  if (!size || size === 0) return 0;
  return (price / size).toFixed(2);
};

export const getNeighborhoodInfo = (neighborhood) => {
  const info = {
    'Sachsenhausen': 'Historic, lively, good for nightlife.',
    'Westend': 'Upscale, quiet, near financial district.',
    'Bornheim': 'Trendy, cafes, Berger Straße.',
    'Nordend': 'Family friendly, parks, cafes.',
    'Bockenheim': 'Student friendly, diverse, affordable.',
    'Gallus': 'Up-and-coming, modern apartments.',
    'Ostend': 'Near EZB, riverside, modern.'
  };
  return info[neighborhood] || 'Frankfurt area';
};

export const getAmenityIcon = (amenity) => {
  const map = {
    'balcony': '🌅',
    'kitchen': '🍳',
    'parking': '🚗',
    'furnished': '🛋️',
    'elevator': '🛗',
    'garden': '🌳',
    'cellar': '📦'
  };
  return map[amenity.toLowerCase()] || '✨';
};
