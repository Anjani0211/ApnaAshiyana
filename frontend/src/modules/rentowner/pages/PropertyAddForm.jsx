import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CameraIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { propertyService } from '../../../services/propertyService';
import { toast } from 'react-toastify';
import { uploadMultipleToCloudinary, uploadToCloudinary } from '../../../utils/cloudinary';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyAddForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: 'entire',
    rent: '',
    deposit: '',
    location: '',
    area: '',
    street: '',
    pincode: '',
    landmark: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    furnished: '',
    amenities: {
      wifi: false,
      parking: false,
      security: false,
      powerBackup: false,
      waterSupply: '', // String enum: '24x7', 'limited', 'tanker'
      kitchen: false,
      bathroom: '', // String enum: 'attached', 'shared', 'common'
      balcony: false,
      ac: false,
      tv: false,
      refrigerator: false,
      washingMachine: false,
      waterHeater: false
    },
    rules: {
      nonVeg: false,
      drinking: false,
      smoking: false,
      parties: false,
      pets: false,
      guestAllowed: false,
      girlsOnly: false,
      boysOnly: false,
      familyOnly: false,
      studentsOnly: false
    },
    nearbyPlaces: {
      colleges: [],
      hospitals: [],
      markets: [],
      landmarks: []
    },
    images: [],
    availableFrom: '',
    coordinates: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(''); // 'uploading', 'creating', 'complete'
  const [errors, setErrors] = useState({});
  const [mapCenter, setMapCenter] = useState([23.3441, 85.3096]); // Ranchi center
  const [createdPropertyId, setCreatedPropertyId] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', icon: HomeIcon },
    { id: 2, title: 'Location Details', icon: MapPinIcon },
    { id: 3, title: 'Pricing & Features', icon: CurrencyRupeeIcon },
    { id: 4, title: 'Photos & Rules', icon: CameraIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (parent, child, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: prev[parent][child].includes(value)
          ? prev[parent][child].filter(item => item !== value)
          : [...prev[parent][child], value]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.type) newErrors.type = 'Property type is required';
        if (!formData.rent || formData.rent <= 0) newErrors.rent = 'Valid rent amount is required';
        if (!formData.deposit || formData.deposit <= 0) newErrors.deposit = 'Valid deposit amount is required';
        break;
      case 2:
        if (!formData.area) newErrors.area = 'Area is required';
        if (!formData.street || !formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.pincode || !/^83[0-9]{4}$/.test(formData.pincode)) newErrors.pincode = 'Valid Jharkhand pincode (83xxxx) is required';
        if (!formData.coordinates || formData.coordinates.length !== 2) newErrors.coordinates = 'Please pin your property location on the map';
        break;
      case 3:
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
        if (!formData.bathrooms) newErrors.bathrooms = 'Number of bathrooms is required';
        break;
      case 4:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate all steps before submission
  const validateAllSteps = () => {
    const allErrors = {};
    let hasErrors = false;
    
    // Validate each step
    for (let step = 1; step <= steps.length; step++) {
      const stepErrors = {};
      
      switch (step) {
        case 1:
          if (!formData.title.trim()) stepErrors.title = 'Property title is required';
          if (!formData.type) stepErrors.type = 'Property type is required';
          if (!formData.rent || formData.rent <= 0 || isNaN(formData.rent)) stepErrors.rent = 'Valid rent amount is required';
          if (!formData.deposit || formData.deposit <= 0 || isNaN(formData.deposit)) stepErrors.deposit = 'Valid deposit amount is required';
          break;
        case 2:
          if (!formData.area) stepErrors.area = 'Area is required';
          if (!formData.street || !formData.street.trim()) stepErrors.street = 'Street address is required';
          if (!formData.pincode || !/^83[0-9]{4}$/.test(formData.pincode)) stepErrors.pincode = 'Valid Jharkhand pincode (83xxxx) is required';
          if (!formData.coordinates || !Array.isArray(formData.coordinates) || formData.coordinates.length !== 2) {
            stepErrors.coordinates = 'Please pin your property location on the map';
          }
          break;
        case 3:
          if (!formData.description.trim()) stepErrors.description = 'Description is required';
          if (!formData.bedrooms || formData.bedrooms === '') stepErrors.bedrooms = 'Number of bedrooms is required';
          if (!formData.bathrooms || formData.bathrooms === '') stepErrors.bathrooms = 'Number of bathrooms is required';
          break;
        case 4:
          if (!formData.images || formData.images.length === 0) stepErrors.images = 'At least one image is required';
          break;
      }
      
      // Merge step errors into allErrors
      Object.assign(allErrors, stepErrors);
      if (Object.keys(stepErrors).length > 0) {
        hasErrors = true;
      }
    }
    
    setErrors(allErrors);
    return { isValid: !hasErrors, errors: allErrors };
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        // Store as [lng, lat] for GeoJSON format (backend expects this)
        setFormData(prev => ({
          ...prev,
          coordinates: [lng, lat]
        }));
        setMapCenter([lat, lng]); // Leaflet uses [lat, lng]
        toast.success('Location pinned successfully!');
      }
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ALL steps before submission
    const validation = validateAllSteps();
    
    if (!validation.isValid) {
      // Show error message with count of errors
      const errorCount = Object.keys(validation.errors).length;
      toast.error(`Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`, {
        autoClose: 5000,
        position: 'top-center'
      });
      
      // Scroll to first error field
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                           document.querySelector(`#${firstErrorField}`) ||
                           document.querySelector(`.error-${firstErrorField}`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        } else {
          // If field not found, scroll to top of form
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      
      // Navigate to the step with the first error
      if (validation.errors.title || validation.errors.type || validation.errors.rent || validation.errors.deposit) {
        setCurrentStep(1);
      } else if (validation.errors.area || validation.errors.street || validation.errors.pincode || validation.errors.coordinates) {
        setCurrentStep(2);
      } else if (validation.errors.description || validation.errors.bedrooms || validation.errors.bathrooms) {
        setCurrentStep(3);
      } else if (validation.errors.images) {
        setCurrentStep(4);
      }
      
      return; // Stop submission
    }
    
    // Additional validation for data types
    if (isNaN(parseInt(formData.rent)) || parseInt(formData.rent) <= 0) {
      setErrors(prev => ({ ...prev, rent: 'Valid rent amount is required' }));
      toast.error('Please enter a valid rent amount');
      setCurrentStep(1);
      return;
    }
    
    if (isNaN(parseInt(formData.deposit)) || parseInt(formData.deposit) <= 0) {
      setErrors(prev => ({ ...prev, deposit: 'Valid deposit amount is required' }));
      toast.error('Please enter a valid deposit amount');
      setCurrentStep(1);
      return;
    }
    
    if (!formData.bedrooms || isNaN(parseInt(formData.bedrooms)) || parseInt(formData.bedrooms) < 0) {
      setErrors(prev => ({ ...prev, bedrooms: 'Number of bedrooms is required' }));
      toast.error('Please enter a valid number of bedrooms');
      setCurrentStep(3);
      return;
    }
    
    if (!formData.bathrooms || isNaN(parseInt(formData.bathrooms)) || parseInt(formData.bathrooms) < 0) {
      setErrors(prev => ({ ...prev, bathrooms: 'Number of bathrooms is required' }));
      toast.error('Please enter a valid number of bathrooms');
      setCurrentStep(3);
      return;
    }
    
    // Validate coordinates
    if (!formData.coordinates || !Array.isArray(formData.coordinates) || formData.coordinates.length !== 2) {
      setErrors(prev => ({ ...prev, coordinates: 'Please pin your property location on the map' }));
      toast.error('Please pin your property location on the map');
      setCurrentStep(2);
      return;
    }
    
    // Validate images
    if (!formData.images || formData.images.length === 0) {
      setErrors(prev => ({ ...prev, images: 'At least one image is required' }));
      toast.error('Please upload at least one image');
      setCurrentStep(4);
      return;
    }
    
    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadStatus('uploading');
      
      // Prepare form data for submission
      const submitData = {
        title: formData.title,
        propertyType: formData.type,
        category: formData.category || 'entire', // Default category
        rent: parseInt(formData.rent),
        deposit: parseInt(formData.deposit),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        furnishingStatus: formData.furnished || 'unfurnished',
        description: formData.description,
        availableFrom: formData.availableFrom,
        location: {
          type: 'Point',
          coordinates: formData.coordinates || [85.3096, 23.3441] // [lng, lat] - Ranchi default
        },
        address: {
          street: formData.street,
          area: formData.area,
          pincode: formData.pincode,
          landmark: formData.landmark || '',
          city: 'Ranchi',
          state: 'Jharkhand'
        },
        amenities: (() => {
          const amenitiesObj = { ...formData.amenities };
          // Remove empty strings for waterSupply and bathroom (backend expects valid enum or undefined)
          if (!amenitiesObj.waterSupply || amenitiesObj.waterSupply === '') {
            delete amenitiesObj.waterSupply;
          }
          if (!amenitiesObj.bathroom || amenitiesObj.bathroom === '') {
            delete amenitiesObj.bathroom;
          }
          return amenitiesObj;
        })(),
        rules: formData.rules,
        nearbyPlaces: formData.nearbyPlaces,
        isAvailable: true,
        isVerified: false
      };
      
      // Upload images - try Cloudinary first, fallback to backend
      let imageUrls = [];
      if (formData.images.length > 0) {
        setUploadStatus('uploading');
        setUploadProgress(10);
        
        const files = formData.images.map(img => img.file);
        const totalFiles = files.length;
        let useBackendUpload = false;
        
        // Try Cloudinary first if configured
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        if (cloudName && cloudName !== 'your-cloud-name') {
          try {
            toast.info(`Uploading ${totalFiles} images to Cloudinary...`);
            setUploadProgress(10);
            
            // Upload all images in parallel for faster upload
            const uploadPromises = files.map((file, index) => {
              return uploadToCloudinary(file).then(result => {
                // Update progress for each completed upload
                const progress = 10 + ((index + 1) * 70 / totalFiles);
                setUploadProgress(Math.min(progress, 80));
                return result.url;
              });
            });
            
            // Wait for all uploads to complete
            imageUrls = await Promise.all(uploadPromises);
            setUploadProgress(80);
            toast.success(`${totalFiles} images uploaded successfully!`);
          } catch (uploadError) {
            console.warn('Cloudinary upload failed, falling back to backend upload:', uploadError);
            toast.warning('Cloudinary upload failed, using backend upload...');
            useBackendUpload = true;
            imageUrls = []; // Reset
          }
        } else {
          // Cloudinary not configured, use backend
          useBackendUpload = true;
        }
        
        // Fallback to backend upload
        if (useBackendUpload) {
          toast.info(`Uploading ${totalFiles} images via backend...`);
          setUploadProgress(20);
          
          // Create property first to get ID
          const tempSubmitData = { ...submitData };
          delete tempSubmitData.images; // Remove images temporarily
          
          try {
            const tempResponse = await propertyService.createProperty(tempSubmitData);
            const propertyId = tempResponse.data._id || tempResponse.data.id;
            
            setUploadProgress(40);
            
            // Upload images via backend (all at once - multer handles multiple files)
            const formDataForImages = new FormData();
            files.forEach((file) => {
              formDataForImages.append('images', file);
            });
            
            // Upload with progress tracking
            toast.info('Uploading images... This may take a moment for large files.');
            await propertyService.uploadImages(propertyId, formDataForImages);
            setUploadProgress(85);
            
            // Fetch updated property to get image URLs
            const updatedProperty = await propertyService.getPropertyById(propertyId);
            imageUrls = updatedProperty.data?.images || updatedProperty.images || [];
            setUploadProgress(90);
            
            // Property created successfully with images
            setUploadProgress(100);
            setUploadStatus('complete');
            toast.success('Property created successfully!');
            
            // Navigate to dashboard after a short delay
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
            return;
          } catch (error) {
            console.error('Backend upload error:', error);
            // If upload fails but property was created, we should still handle it
            if (error.response?.status !== 400 && error.response?.status !== 404) {
              throw error; // Re-throw to be caught by outer catch
            }
            // If property creation failed, throw error
            throw error;
          }
        }
      }
      
      // Add image URLs to submit data
      if (imageUrls.length > 0) {
        submitData.images = imageUrls;
      }
      
      // Create the property with image URLs
      setUploadStatus('creating');
      setUploadProgress(85);
      
      const response = await propertyService.createProperty(submitData);
      const propertyId = response.data._id || response.data.id;
      
      setUploadProgress(100);
      setUploadStatus('complete');
      
      toast.success('Property created successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error creating property:', error);
      
      // Show specific error message
      let errorMessage = 'Error creating property. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      // Check for common errors
      if (errorMessage.includes('Cloudinary') || errorMessage.includes('cloud name') || errorMessage.includes('upload preset')) {
        errorMessage += '. Please configure Cloudinary credentials in your .env file.';
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
        position: 'top-center'
      });
      
      setUploadProgress(0);
      setUploadStatus('');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., 2BHK Apartment near BIT Mesra"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="label">Property Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`input ${errors.type ? 'border-red-500' : ''}`}
              >
                <option value="">Select Property Type</option>
                <option value="room">Room</option>
                <option value="pg">PG</option>
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="hostel">Hostel</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input"
              >
                <option value="student">Student</option>
                <option value="family">Family</option>
                <option value="shared">Shared</option>
                <option value="entire">Entire Property</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className={`input ${errors.rent ? 'border-red-500' : ''}`}
                  placeholder="12000"
                />
                {errors.rent && <p className="text-red-500 text-sm mt-1">{errors.rent}</p>}
              </div>
              <div>
                <label className="label">Security Deposit (₹) *</label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className={`input ${errors.deposit ? 'border-red-500' : ''}`}
                  placeholder="24000"
                />
                {errors.deposit && <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>}
              </div>
            </div>

            <div>
              <label className="label">Available From</label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Area in Ranchi *</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className={`input ${errors.area ? 'border-red-500' : ''}`}
              >
                <option value="">Select Area</option>
                <option value="mesra">Mesra</option>
                <option value="bariatu">Bariatu</option>
                <option value="morabadi">Morabadi</option>
                <option value="kanke">Kanke</option>
                <option value="lalpur">Lalpur</option>
                <option value="harmu">Harmu</option>
                <option value="doranda">Doranda</option>
                <option value="hindpiri">Hindpiri</option>
                <option value="kadru">Kadru</option>
                <option value="ratu-road">Ratu Road</option>
                <option value="main-road">Main Road</option>
                <option value="hec">HEC</option>
                <option value="kokar">Kokar</option>
                <option value="namkum">Namkum</option>
                <option value="tatisilwai">Tatisilwai</option>
                <option value="bundu">Bundu</option>
                <option value="angara">Angara</option>
                <option value="ormanjhi">Ormanjhi</option>
              </select>
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="label">Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className={`input ${errors.street ? 'border-red-500' : ''}`}
                placeholder="e.g., Near BIT Mesra Campus"
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>

            <div>
              <label className="label">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`input ${errors.pincode ? 'border-red-500' : ''}`}
                placeholder="835215"
                pattern="83[0-9]{4}"
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <label className="label">Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="input"
                placeholder="e.g., Near Ranchi Railway Station"
              />
            </div>

            {/* Map Section */}
            <div>
              <label className="label">Pin Your Property Location *</label>
              <div className="text-sm text-gray-600 mb-3">
                Click on the map to mark the exact location of your property. This helps tenants find your property easily.
              </div>
              
              <div className="h-80 rounded-lg overflow-hidden border-2 border-gray-200">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler />
                  {formData.coordinates && (
                    <Marker position={[formData.coordinates[1], formData.coordinates[0]]}>
                      <div className="p-2">
                        <p className="font-semibold text-sm">Your Property</p>
                        <p className="text-xs text-gray-600">{formData.title || 'Property Location'}</p>
                      </div>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {formData.coordinates && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Location pinned successfully!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Coordinates: {formData.coordinates[1].toFixed(6)} (lat), {formData.coordinates[0].toFixed(6)} (lng)
                  </p>
                </div>
              )}

              {errors.coordinates && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-3">
                  <p className="text-red-800 text-sm">{errors.coordinates}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Property Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`input h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your property, its features, and what makes it special..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Bedrooms *</label>
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className={`input ${errors.bedrooms ? 'border-red-500' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
                {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
              </div>
              <div>
                <label className="label">Bathrooms *</label>
                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className={`input ${errors.bathrooms ? 'border-red-500' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
                {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
              </div>
            </div>

            <div>
              <label className="label">Furnishing Status</label>
              <select
                name="furnished"
                value={formData.furnished}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">Select</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="label">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {Object.entries(formData.amenities)
                  .filter(([key]) => key !== 'waterSupply' && key !== 'bathroom')
                  .map(([key, value]) => (
                    <label key={key} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        name={`amenities.${key}`}
                        checked={value}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
              </div>

              {/* Water Supply - Special dropdown */}
              <div className="mb-4">
                <label className="label">Water Supply</label>
                <select
                  name="amenities.waterSupply"
                  value={formData.amenities.waterSupply}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select Water Supply</option>
                  <option value="24x7">24x7 Available</option>
                  <option value="limited">Limited Hours</option>
                  <option value="tanker">Tanker Supply</option>
                </select>
              </div>

              {/* Bathroom Type - Special dropdown */}
              <div>
                <label className="label">Bathroom Type</label>
                <select
                  name="amenities.bathroom"
                  value={formData.amenities.bathroom}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select Bathroom Type</option>
                  <option value="attached">Attached Bathroom</option>
                  <option value="shared">Shared Bathroom</option>
                  <option value="common">Common Bathroom</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="label">Property Photos *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                </label>
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="label">House Rules</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(formData.rules).map(([key, value]) => (
                  <label key={key} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name={`rules.${key}`}
                      checked={value}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3"
                    />
                    <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Property
          </h1>
          <p className="text-gray-600">
            List your property and start earning rental income
          </p>
        </motion.div>

        <div className="card p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive 
                        ? 'border-primary-500 bg-primary-500 text-white' 
                        : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-primary-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Previous
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Next
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {uploadStatus === 'uploading' ? 'Uploading...' : uploadStatus === 'creating' ? 'Creating...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Create Property
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Unlock Payment Modal */}

          {/* Upload Progress Modal */}
          {loading && uploadStatus && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {uploadStatus === 'uploading' && 'Uploading Images'}
                    {uploadStatus === 'creating' && 'Creating Property'}
                    {uploadStatus === 'complete' && 'Complete!'}
                  </h3>
                  <p className="text-gray-600">
                    {uploadStatus === 'uploading' && 'Please wait while we upload your property images to Cloudinary...'}
                    {uploadStatus === 'creating' && 'Saving your property details to the database...'}
                    {uploadStatus === 'complete' && 'Your property has been successfully created!'}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  {uploadProgress}% Complete
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyAddForm;
