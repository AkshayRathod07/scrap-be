const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const fileUpload = require('express-fileupload');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// Allow requests from your frontend's URL
app.use(cors({
    origin: 'http://localhost:3000',  // Frontend URL during development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true // If you need to include cookies or authentication headers
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scrap-requests', require('./routes/scrapRequestRoutes'));
app.use('/api/pickups', require('./routes/pickupRoutes'));



// Test API route
app.get('/', (req, res) => {
    res.send('Scrap Collector API is running...');
});

// Socket.IO Logic
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // Change this for production
        methods: ['GET', 'POST']
    }
});

// Active Users for Real-time Communication
const activeCollectors = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('registerCollector', (userId) => {
        activeCollectors.set(userId, socket.id);
    });

    socket.on('disconnect', () => {
        activeCollectors.forEach((value, key) => {
            if (value === socket.id) activeCollectors.delete(key);
        });
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Notify Collectors on New Scrap Request
exports.notifyCollectors = (scrapRequest) => {
    activeCollectors.forEach((socketId) => {
        io.to(socketId).emit('newScrapRequest', scrapRequest);
    });
};

// ✅ Correct Export for Vercel
module.exports = app; // For Vercel

// Local Development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
