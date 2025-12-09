// Dummy images for properties
export const DUMMY_PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
  'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
];

// Get random image for property
export const getRandomPropertyImage = () => {
  return DUMMY_PROPERTY_IMAGES[Math.floor(Math.random() * DUMMY_PROPERTY_IMAGES.length)];
};

// Get multiple random images
export const getRandomPropertyImages = (count = 4) => {
  const shuffled = [...DUMMY_PROPERTY_IMAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Property type specific images
export const PROPERTY_TYPE_IMAGES = {
  apartment: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  ],
  house: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  ],
  pg: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  ],
  flat: [
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
  ],
  room: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800&q=80',
  ],
};

export const getPropertyTypeImages = (type) => {
  return PROPERTY_TYPE_IMAGES[type] || DUMMY_PROPERTY_IMAGES.slice(0, 3);
};

