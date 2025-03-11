const express = require('express');
const { schedulePickup, getPickups } = require('../controllers/pickupController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, schedulePickup);
router.get('/', protect, getPickups);

module.exports = router;
