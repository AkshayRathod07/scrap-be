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
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;
