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
      waterSupply: false,
      kitchen: false,
      bathroom: false,
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
  const [errors, setErrors] = useState({});
  const [mapCenter, setMapCenter] = useState([23.3441, 85.3096]); // Ranchi center

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
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.area) newErrors.area = 'Area is required';
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.pincode || !/^83[0-9]{4}$/.test(formData.pincode)) newErrors.pincode = 'Valid Jharkhand pincode is required';
        if (!formData.coordinates) newErrors.coordinates = 'Please pin your property location on the map';
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
        setFormData(prev => ({
          ...prev,
          coordinates: [lat, lng]
        }));
        setMapCenter([lat, lng]);
        toast.success('Location pinned successfully!');
      }
    });
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare form data for submission
      const submitData = {
        ...formData,
        rent: parseInt(formData.rent),
        deposit: parseInt(formData.deposit),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        city: 'Ranchi',
        state: 'Jharkhand',
        verified: false,
        status: 'available'
      };
      
      // Convert images to base64 for now (in production, upload to cloud storage)
      const imagePromises = formData.images.map(image => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(image.file);
        });
      });
      
      const imageDataUrls = await Promise.all(imagePromises);
      submitData.imageUrls = imageDataUrls;
      
      // Save to database
      await propertyService.createProperty(submitData);
      
      toast.success('Property added successfully!');
      navigate('/rentowner/dashboard');
      
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Error creating property. Please try again.');
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
                <option value="apartment">Apartment</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
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
                    <Marker position={formData.coordinates}>
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
                    Coordinates: {formData.coordinates[0].toFixed(6)}, {formData.coordinates[1].toFixed(6)}
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(formData.amenities).map(([key, value]) => (
                  <label key={key} className="flex items-center">
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
                      Creating...
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
        </div>
      </div>
    </div>
  );
};

export default PropertyAddForm;
