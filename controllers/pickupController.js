const Pickup = require('../models/Pickup');

// Schedule Pickup
exports.schedulePickup = async (req, res) => {
    const { scrapRequestId, scheduledTime } = req.body;

    try {
        const pickup = await Pickup.create({
            scrapRequestId,
            collectorId: req.user.id,
            scheduledTime
        });

        res.status(201).json({ message: 'Pickup scheduled successfully', pickup });
    } catch (error) {
        res.status(500).json({ error: 'Failed to schedule pickup' });
    }
};

// List Pickup Requests
exports.getPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find().populate('scrapRequestId').populate('collectorId', 'name email');
        res.status(200).json(pickups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pickups' });
    }
};
