const mongoose = require('mongoose');

// const connectDB = async () => {
//     console.log('process.env.MONGO_URI', process.env.MONGO_URI);

//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('MongoDB connected successfully');
//     } catch (err) {
//         console.error('MongoDB connection failed:', err);
//         process.exit(1);
//     }
// };

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1); // Exit on failure
    }
};

module.exports = connectDB;
