const Pickup = require('../models/Pickup');
const ScrapRequest = require('../models/ScrapRequest');

// Schedule Pickup
// Schedule Pickup and Update Scrap Request Status
exports.schedulePickup = async (req, res) => {
    const { scrapRequestId, scheduledTime, status } = req.body;

    try {
        const pickup = await Pickup.create({
            scrapRequestId,
            collectorId: req.user.id,
            scheduledTime,
            status
        });

        // Update ScrapRequest status based on Pickup status
        await ScrapRequest.findByIdAndUpdate(scrapRequestId, {
            status: status === 'completed' ? 'completed' : 'accepted'
        });

        res.status(201).json({ message: 'Pickup scheduled successfully', pickup });
    } catch (error) {
        console.error('Error scheduling pickup:', error);
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
