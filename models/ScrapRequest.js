const mongoose = require('mongoose');

const scrapRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    scrapType: {
        type: String,
        enum: ['Paper', 'Plastic', 'Metal', 'E-Waste', 'Glass', 'Other'],
        required: true
    },
    scrapName: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
    scheduledPickup: { type: Date },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { timestamps: true });

scrapRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ScrapRequest', scrapRequestSchema);
