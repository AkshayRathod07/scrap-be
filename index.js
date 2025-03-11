const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scrap-requests', require('./routes/scrapRequestRoutes'));
app.use('/api/pickups', require('./routes/pickupRoutes'));


const io = new Server(server, {
    cors: {
        origin: '*', // Change this for production
        methods: ['GET', 'POST']
    }
});

// Store active users for real-time communication
const activeCollectors = new Map();

// Socket.IO Logic
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
