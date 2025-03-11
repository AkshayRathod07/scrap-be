const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
    scrapRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScrapRequest', required: true },
    collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledTime: { type: Date },
    status: { type: String, enum: ['accepted', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', pickupSchema);
