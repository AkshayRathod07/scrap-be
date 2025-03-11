const express = require('express');
const { createScrapRequest, getScrapRequests, updateScrapRequestStatus, upload, findNearbyRequests, getUserScrapRequests } = require('../controllers/scrapRequestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createScrapRequest); // Photo upload
router.get('/', protect, getScrapRequests);
router.patch('/:id/status', protect, updateScrapRequestStatus);
router.get('/nearby', protect, findNearbyRequests);

router.get('/user', protect, getUserScrapRequests);


module.exports = router;
