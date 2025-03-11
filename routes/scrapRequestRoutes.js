const express = require('express');
const { createScrapRequest, getScrapRequests, updateScrapRequestStatus, upload } = require('../controllers/scrapRequestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), createScrapRequest); // Photo upload
router.get('/', protect, getScrapRequests);
router.patch('/:id/status', protect, updateScrapRequestStatus);

module.exports = router;
