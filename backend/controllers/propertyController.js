const path = require('path');
const fs = require('fs').promises;
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Property = require('../models/propertyModel');
const { uploadBufferToCloudinary, isCloudinaryConfigured } = require('../utils/cloudinary');
const geocoder = require('../utils/geocoder');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  const results = res.advancedResults;
  
  // Check if user has paid - hide owner contact info if not paid
  const userHasPaid = req.user?.hasPaid || false;
  
  // If user hasn't paid, remove owner contact info and address details from results
  if (!userHasPaid && results.data) {
    results.data = results.data.map(property => {
      const propertyObj = property.toObject ? property.toObject() : property;
      if (propertyObj.owner) {
        propertyObj.owner = {
          ...propertyObj.owner,
          phone: undefined,
          email: undefined
        };
      }
      // Hide exact address, keep only area
      if (propertyObj.address) {
        propertyObj.address = {
          area: propertyObj.address.area,
          city: propertyObj.address.city
          // Don't include street, pincode, or exact location
        };
      }
      // Hide exact coordinates
      if (propertyObj.location) {
        propertyObj.location = {
          type: propertyObj.location.type
          // Don't include coordinates
        };
      }
      return propertyObj;
    });
  }
  
  res.status(200).json(results);
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate({
    path: 'owner',
    select: 'name email phone isVerified isIdVerified'
  });

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count
  property.views = (property.views || 0) + 1;
  await property.save();

  // Check if user has paid - hide contact info if not paid
  const userHasPaid = req.user?.hasPaid || false;
  
  const propertyData = property.toObject();
  
  // Hide owner contact info and exact location if user hasn't paid
  if (!userHasPaid) {
    if (propertyData.owner) {
      propertyData.owner.phone = undefined;
      propertyData.owner.email = undefined;
    }
    // Hide exact address details, keep only area and city
    if (propertyData.address) {
      propertyData.address = {
        area: propertyData.address.area,
        city: propertyData.address.city
        // Don't include street, pincode
      };
    }
    // Hide exact coordinates
    if (propertyData.location && propertyData.location.coordinates) {
      propertyData.location.coordinates = undefined;
    }
  }

  res.status(200).json({
    success: true,
    data: propertyData,
    userHasPaid: userHasPaid
  });
});

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.owner = req.user.id;

  // Check if user is verified
  if (!req.user.isVerified) {
    return next(
      new ErrorResponse(
        'Please verify your email before listing a property',
        403
      )
    );
  }

  // Check if user has paid (required for listing)
  if (!req.user.hasPaid) {
    return next(
      new ErrorResponse(
        'Payment required. Please make a payment to list properties',
        403
      )
    );
  }

  // Check if user is ID verified for property listing
  if (!req.user.isIdVerified) {
    return next(
      new ErrorResponse(
        'Please verify your ID before listing a property',
        403
      )
    );
  }

  // Property is created and available for viewing

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    data: property
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this property`,
        403
      )
    );
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this property`,
        403
      )
    );
  }

  await property.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload property images
// @route   PUT /api/properties/:id/images
// @access  Private
exports.propertyImageUpload = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this property`,
        403
      )
    );
  }

  if (!req.files || !req.files.images) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const files = req.files.images;
  const useCloudinary = isCloudinaryConfigured();
  
  // Make sure the uploaded file is an image
  if (!Array.isArray(files)) {
    // Single file upload
    const file = files;
    
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
          400
        )
      );
    }

    try {
      if (useCloudinary) {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadBufferToCloudinary(
          file.buffer,
          file.originalname,
          `kirayedar/properties/${property._id}`
        );
        
        await Property.findByIdAndUpdate(req.params.id, {
          $push: { images: cloudinaryResult.url }
        });

        res.status(200).json({
          success: true,
          data: cloudinaryResult.url,
          cloudinary: true
        });
      } else {
        // Fallback to local storage
        const fileName = `property_${property._id}_${Date.now()}${path.parse(file.originalname).ext}`;
        const uploadPath = `${process.env.FILE_UPLOAD_PATH}/properties/${fileName}`;
        
        // Ensure directory exists
        const dirPath = `${process.env.FILE_UPLOAD_PATH}/properties`;
        await fs.mkdir(dirPath, { recursive: true });
        
        await fs.writeFile(uploadPath, file.buffer);
        
        await Property.findByIdAndUpdate(req.params.id, {
          $push: { images: fileName }
        });

        res.status(200).json({
          success: true,
          data: fileName,
          cloudinary: false
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      return next(new ErrorResponse(`Problem with file upload: ${error.message}`, 500));
    }
  } else {
    // Handle multiple files
    let imageUrls = [];

    // Validate all files first
    for (const file of files) {
      if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload image files only`, 400));
      }

      if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(
            `Please upload images less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB each`,
            400
          )
        );
      }
    }

    try {
      if (useCloudinary) {
        // Upload all to Cloudinary in parallel for faster uploads
        const uploadPromises = files.map(file => 
          uploadBufferToCloudinary(
            file.buffer,
            file.originalname,
            `kirayedar/properties/${property._id}`
          )
        );
        
        const cloudinaryResults = await Promise.all(uploadPromises);
        imageUrls = cloudinaryResults.map(result => result.url);
        
        await Property.findByIdAndUpdate(req.params.id, {
          $push: { images: { $each: imageUrls } }
        });

        res.status(200).json({
          success: true,
          count: imageUrls.length,
          data: imageUrls,
          cloudinary: true
        });
      } else {
        // Fallback to local storage
        const dirPath = `${process.env.FILE_UPLOAD_PATH}/properties`;
        await fs.mkdir(dirPath, { recursive: true });
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `property_${property._id}_${Date.now()}_${i}${path.parse(file.originalname).ext}`;
          const uploadPath = `${dirPath}/${fileName}`;
          
          await fs.writeFile(uploadPath, file.buffer);
          imageUrls.push(fileName);
        }

        await Property.findByIdAndUpdate(req.params.id, {
          $push: { images: { $each: imageUrls } }
        });

        res.status(200).json({
          success: true,
          count: imageUrls.length,
          data: imageUrls,
          cloudinary: false
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      return next(new ErrorResponse(`Problem with file upload: ${error.message}`, 500));
    }
  }
});

// @desc    Get current user's properties
// @route   GET /api/properties/user
// @access  Private
exports.getUserProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find({ owner: req.user.id })
    .populate({
      path: 'owner',
      select: 'name email phone isVerified isIdVerified'
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get properties within radius
// @route   GET /api/properties/radius/:pincode/:distance
// @access  Public
exports.getPropertiesInRadius = asyncHandler(async (req, res, next) => {
  const { pincode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(pincode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 6378;

  const properties = await Property.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get properties by filters
// @route   GET /api/properties/filter
// @access  Public
exports.filterProperties = asyncHandler(async (req, res, next) => {
  const {
    propertyType,
    category,
    city,
    state,
    minRent,
    maxRent,
    furnishingStatus,
    availableFrom,
    amenities,
    rules
  } = req.query;

  // Build query
  const query = {};

  // Add property type to query
  if (propertyType) {
    query.propertyType = propertyType;
  }

  // Add category to query
  if (category) {
    query.category = category;
  }

  // Add city to query
  if (city) {
    query['address.city'] = new RegExp(city, 'i');
  }

  // Add state to query
  if (state) {
    query['address.state'] = new RegExp(state, 'i');
  }

  // Add rent range to query
  if (minRent || maxRent) {
    query.rent = {};
    if (minRent) query.rent.$gte = Number(minRent);
    if (maxRent) query.rent.$lte = Number(maxRent);
  }

  // Add furnishing status to query
  if (furnishingStatus) {
    query.furnishingStatus = furnishingStatus;
  }

  // Add available from date to query
  if (availableFrom) {
    query.availableFrom = { $lte: new Date(availableFrom) };
  }

  // Add amenities to query
  if (amenities) {
    const amenitiesArray = amenities.split(',');
    amenitiesArray.forEach(amenity => {
      query[`amenities.${amenity}`] = true;
    });
  }

  // Add rules to query
  if (rules) {
    const rulesArray = rules.split(',');
    rulesArray.forEach(rule => {
      query[`rules.${rule}`] = true;
    });
  }

  // Add isAvailable and isVerified to query
  query.isAvailable = true;
  query.isVerified = true;

  // Finding resource
  const properties = await Property.find(query).populate({
    path: 'owner',
    select: 'name isVerified isIdVerified'
  });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Verify property
// @route   PUT /api/properties/:id/verify
// @access  Private/Admin
exports.verifyProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  property.isVerified = true;
  await property.save();

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Get featured properties (top 8 by likes, views, prime location)
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find({
    isAvailable: true
  })
    .populate({
      path: 'owner',
      select: 'name isVerified'
    })
    .sort({ 
      createdAt: -1  // Show newest properties first
    })
    .limit(8); // Increased limit to show more properties

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties
  });
});

// @desc    Get area-wise property counts
// @route   GET /api/properties/area-counts
// @access  Public
exports.getAreaCounts = asyncHandler(async (req, res, next) => {
  const areaCounts = await Property.aggregate([
    {
      $match: {
        isAvailable: true,
        isVerified: true
      }
    },
    {
      $group: {
        _id: '$address.area',
        count: { $sum: 1 },
        properties: {
          $push: {
            id: '$_id',
            title: '$title',
            rent: '$rent',
            location: '$location.coordinates',
            address: '$address'
          }
        }
      }
    },
    {
      $project: {
        area: '$_id',
        count: 1,
        properties: 1,
        _id: 0
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: areaCounts
  });
});

// @desc    Like/Unlike a property
// @route   PUT /api/properties/:id/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  const userId = req.user.id;
  const likedIndex = property.likedBy.findIndex(
    id => id.toString() === userId.toString()
  );

  if (likedIndex > -1) {
    // Unlike
    property.likedBy.splice(likedIndex, 1);
    property.likes = Math.max(0, (property.likes || 0) - 1);
  } else {
    // Like
    property.likedBy.push(userId);
    property.likes = (property.likes || 0) + 1;
  }

  await property.save();

  res.status(200).json({
    success: true,
    data: {
      likes: property.likes,
      isLiked: likedIndex === -1
    }
  });
});

// @desc    Toggle property availability
// @route   PUT /api/properties/:id/toggle-availability
// @access  Private
exports.toggleAvailability = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is property owner
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this property`,
        403
      )
    );
  }

  property.isAvailable = !property.isAvailable;
  await property.save();

  res.status(200).json({
    success: true,
    data: property
  });
});