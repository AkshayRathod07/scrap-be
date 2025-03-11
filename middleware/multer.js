const multer = require('multer');
const path = require('path');

// Storage Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        cb(null, `${Date.now()}${fileExt}`);
    }
});

// File Filter for Image Upload
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed.'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

module.exports = upload;
