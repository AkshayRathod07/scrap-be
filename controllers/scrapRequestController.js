const ScrapRequest = require('../models/ScrapRequest');
const cloudinary = require('../config/cloudinary');

// Create Scrap Request with Cloudinary Image Upload
exports.createScrapRequest = async (req, res) => {
    const { quantity, scrapType, scrapName, latitude, longitude } = req.body;
    const image = req.files?.image;

    console.log('req', req.body);

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Location coordinates are required' });
    }

    try {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'scrapEase/uploads',
            resource_type: 'image'
        });

        const scrapRequest = await ScrapRequest.create({
            userId: req.user.id,
            image: result.secure_url,
            scrapType,
            scrapName,
            quantity,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]  // Ensure coordinates are numbers
            }
        });

        res.status(201).json({ message: 'Scrap request created successfully', scrapRequest });
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ error: 'Failed to create scrap request', details: error.message });
    }
};


// Find Nearby Scrap Requests
exports.findNearbyRequests = async (req, res) => {
    const { latitude, longitude, radius } = req.query; // Radius in meters

    // Ensure values are numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const maxDistance = parseInt(radius);

    console.log('lat', lat, 'lng', lng, 'maxDistance', maxDistance);


    // Validate values
    if (isNaN(lat) || isNaN(lng) || isNaN(maxDistance)) {
        return res.status(400).json({ error: 'Invalid latitude, longitude, or radius format.' });
    }

    try {
        const scrapRequests = await ScrapRequest.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lng, lat] }, // GeoJSON requires [lng, lat]
                    $maxDistance: maxDistance
                }
            }
        }).populate('userId', 'name email');

        res.status(200).json(scrapRequests);
    } catch (error) {
        console.error('Nearby Requests Error:', error);
        res.status(500).json({ error: 'Failed to fetch nearby scrap requests', details: error.message });
    }
};


// List Scrap Requests
exports.getScrapRequests = async (req, res) => {
    try {
        const scrapRequests = await ScrapRequest.find().populate('userId', 'name email');
        res.status(200).json(scrapRequests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scrap requests', details: error.message });
    }
};

// Update Scrap Request Status
exports.updateScrapRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const scrapRequest = await ScrapRequest.findByIdAndUpdate(id, { status }, { new: true });
        if (!scrapRequest) {
            return res.status(404).json({ error: 'Scrap request not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', scrapRequest });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status', details: error.message });
    }
};

