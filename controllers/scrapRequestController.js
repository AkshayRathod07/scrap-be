const ScrapRequest = require('../models/ScrapRequest');
const cloudinary = require('../config/cloudinary');

// Create Scrap Request with Cloudinary Image Upload
exports.createScrapRequest = async (req, res) => {
    const { quantity, scrapType, scrapName } = req.body;
    const image = req.files?.image; // Using express-fileupload
    console.log('image', image);

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: 'scrapEase/uploads',
            resource_type: 'image'
        });


        const scrapRequest = await ScrapRequest.create({
            userId: req.user.id,
            image: result.secure_url,  // Cloudinary's secure URL
            scrapType,
            scrapName,
            quantity
        });

        res.status(201).json({ message: 'Scrap request created successfully', scrapRequest });
    } catch (error) {
        console.error('Cloudinary Error:', error); // Detailed error log
        res.status(500).json({ error: 'Failed to create scrap request', details: error.message });
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

