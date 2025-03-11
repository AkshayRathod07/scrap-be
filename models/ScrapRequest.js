const mongoose = require('mongoose');

const scrapRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true }, // Image URL
    scrapType: {
        type: String,
        enum: ['Paper', 'Plastic', 'Metal', 'E-Waste', 'Glass', 'Other'],
        required: true
    },
    scrapName: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    scheduledPickup: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ScrapRequest', scrapRequestSchema);
