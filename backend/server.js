const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notifyRoutes');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: ["https://chat-app-1-gq5y.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["https://chat-app-1-gq5y.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Example: Handle chat message event
    socket.on('chatMessage', async (data) => {
        try {
            const { sender, receiver, message } = data;

            // Save message to the database
            const chat = new Chat({ sender, receiver, message });
            await chat.save();

            // Emit the message to the sender and receiver
            socket.emit('message', data);
            socket.broadcast.emit('message', data);

            // Create and emit notification to the receiver
            const senderUser = await User.findById(sender);
            const senderUsername = senderUser ? senderUser.username : 'Unknown';
            const notification = new Notification({
                user: receiver,
                sender: sender,
                message: `You got a message from ${senderUsername}`,
            });
            await notification.save();

            socket.broadcast.emit('notification', {
                user: receiver,
                message: `You got a message from ${senderUsername}`,
            });
        } catch (error) {
            console.error(error);
        }
    });
});
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, "build")));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
