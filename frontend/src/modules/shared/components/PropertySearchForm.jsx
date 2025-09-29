import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyRupeeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const PropertySearchForm = ({ 
  onSearch, 
  initialValues = {},
  compact = false,
  showQuickSearches = true 
}) => {
  const [searchData, setSearchData] = useState({
    location: initialValues.location || '',
    propertyType: initialValues.propertyType || '',
    maxRent: initialValues.maxRent || '',
    category: initialValues.category || '',
    bedrooms: initialValues.bedrooms || '',
    furnished: initialValues.furnished || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleQuickSearch = (location, propertyType) => {
    const quickSearchData = {
      location: location.toLowerCase(),
      propertyType: propertyType,
      maxRent: '',
      category: '',
      bedrooms: '',
      furnished: ''
    };
    setSearchData(quickSearchData);
    onSearch(quickSearchData);
  };

  const clearFilters = () => {
    const clearedData = {
      location: '',
      propertyType: '',
      maxRent: '',
      category: '',
      bedrooms: '',
      furnished: ''
    };
    setSearchData(clearedData);
    onSearch(clearedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${compact ? 'p-4' : 'p-6 md:p-8'}`}
    >
      <form onSubmit={handleSearch} className="space-y-4">
        <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {/* Location */}
          <div>
            <label className="label">Location</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="location"
                value={searchData.location}
                onChange={handleInputChange}
                className="input pl-10"
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
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="label">Property Type</label>
            <div className="relative">
              <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="propertyType"
                value={searchData.propertyType}
                onChange={handleInputChange}
                className="input pl-10"
              >
                <option value="">Any Type</option>
                <option value="room">Room</option>
                <option value="pg">PG</option>
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="label">Max Budget</label>
            <div className="relative">
              <CurrencyRupeeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="maxRent"
                value={searchData.maxRent}
                onChange={handleInputChange}
                className="input pl-10"
              >
                <option value="">Any Budget</option>
                <option value="3000">Under ₹3,000</option>
                <option value="5000">Under ₹5,000</option>
                <option value="8000">Under ₹8,000</option>
                <option value="12000">Under ₹12,000</option>
                <option value="15000">Under ₹15,000</option>
                <option value="20000">Under ₹20,000</option>
                <option value="25000">Under ₹25,000</option>
                <option value="30000">Under ₹30,000</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={searchData.category}
              onChange={handleInputChange}
              className="input"
            >
              <option value="">Any Category</option>
              <option value="student">Student</option>
              <option value="family">Family</option>
              <option value="shared">Shared</option>
              <option value="entire">Entire Property</option>
            </select>
          </div>

          {/* Additional filters for non-compact mode */}
          {!compact && (
            <>
              <div>
                <label className="label">Bedrooms</label>
                <select
                  name="bedrooms"
                  value={searchData.bedrooms}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div>
                <label className="label">Furnishing</label>
                <select
                  name="furnished"
                  value={searchData.furnished}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center px-8 py-3"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Search Properties
          </motion.button>
          
          <motion.button
            type="button"
            onClick={clearFilters}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center px-6 py-3"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Clear Filters
          </motion.button>
        </div>
      </form>

      {/* Quick Search Links */}
      {showQuickSearches && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { text: 'PG near BIT Mesra', type: 'pg', location: 'mesra' },
              { text: 'Flat in Bariatu', type: 'flat', location: 'bariatu' },
              { text: 'Room near Ranchi University', type: 'room', location: 'morabadi' },
              { text: 'House in Morabadi', type: 'house', location: 'morabadi' },
              { text: 'Apartment in Kanke', type: 'apartment', location: 'kanke' },
              { text: 'PG near HEC', type: 'pg', location: 'hec' }
            ].map((search) => (
              <motion.button
                key={search.text}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleQuickSearch(search.location, search.type)}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors duration-200"
              >
                {search.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertySearchForm;
