const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Property = require('../models/propertyModel');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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

  res.status(200).json({
    success: true,
    data: property
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

  // Check if user is ID verified for property listing
  if (!req.user.isIdVerified) {
    return next(
      new ErrorResponse(
        'Please verify your ID before listing a property',
        403
      )
    );
  }

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

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const files = req.files.images;
  
  // Make sure the uploaded file is an image
  if (!Array.isArray(files)) {
    if (!files.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (files.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
          400
        )
      );
    }

    // Create custom filename
    files.name = `property_${property._id}_${Date.now()}${path.parse(files.name).ext}`;

    files.mv(`${process.env.FILE_UPLOAD_PATH}/properties/${files.name}`, async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Property.findByIdAndUpdate(req.params.id, {
        $push: { images: files.name }
      });

      res.status(200).json({
        success: true,
        data: files.name
      });
    });
  } else {
    // Handle multiple files
    const uploadPromises = [];
    const fileNames = [];

    files.forEach(file => {
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

      // Create custom filename
      file.name = `property_${property._id}_${Date.now()}_${fileNames.length}${path.parse(file.name).ext}`;
      fileNames.push(file.name);

      uploadPromises.push(
        new Promise((resolve, reject) => {
          file.mv(`${process.env.FILE_UPLOAD_PATH}/properties/${file.name}`, err => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          });
        })
      );
    });

    try {
      await Promise.all(uploadPromises);
      await Property.findByIdAndUpdate(req.params.id, {
        $push: { images: { $each: fileNames } }
      });

      res.status(200).json({
        success: true,
        count: fileNames.length,
        data: fileNames
      });
    } catch (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  }
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