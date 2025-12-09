// Property service for all property-related operations
import api from '../utils/api';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters = {}) => {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property (for rent owners)
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData, {
      timeout: 60000 // 1 minute for property creation
    });
    return response.data;
  },

  // Update property (for rent owners)
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  // Delete property (for rent owners)
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  // Get user's properties (for rent owners)
  getUserProperties: async () => {
    const response = await api.get('/properties/user');
    return response.data;
  },

  // Search properties
  searchProperties: async (searchParams) => {
    const response = await api.get('/properties/search', { params: searchParams });
    return response.data;
  },

  // Get featured properties for landing page
  getFeaturedProperties: async () => {
    const response = await api.get('/properties/featured');
    return response.data;
  },

  // Get area-wise property counts
  getAreaCounts: async () => {
    const response = await api.get('/properties/area-counts');
    return response.data;
  },

  // Toggle like on property
  toggleLike: async (propertyId) => {
    const response = await api.put(`/properties/${propertyId}/like`);
    return response.data;
  },

  // Upload property images
  uploadImages: async (propertyId, formData) => {
    const response = await api.put(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 300000, // 5 minutes timeout for large file uploads
      onUploadProgress: (progressEvent) => {
        // This will be handled by the caller if needed
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      }
    });
    return response.data;
  }
};
