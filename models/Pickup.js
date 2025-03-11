const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
    scrapRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScrapRequest', required: true },
    collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledTime: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', pickupSchema);
