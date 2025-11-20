const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const searchCache = require('./utils/searchCache');
const User = require('./models/user');


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);
app.use("/" , chatRouter);

function parseCookies(cookieHeader) {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        let parts = cookie.split('=');
        if (parts.length === 2) {
            list[parts[0].trim()] = decodeURIComponent(parts[1]);
        }
    });
    return list;
}

connectDB()
    .then(async ()=>{
        console.log("Database connected");

        await searchCache.buildTrie().catch(err => {
            console.error("Failed to build search index:", err);
        });

        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                credentials: true
            }
        });
        app.set('io', io);

        // Map userId -> socketId(s)
        const userSockets = new Map();

        io.use(async (socket, next) => {
            try {
                const cookies = parseCookies(socket.handshake.headers.cookie);
                const token = cookies.token;
                if (!token) return next(new Error('No auth token'));
                const decoded = jwt.verify(token, "Sai@2304");
                const user = await User.findById(decoded._id);
                if (!user) return next(new Error('User not found'));
                socket.user = user;
                next();
            } catch (err) {
                next(err);
            }
        });

        io.on('connection', (socket) => {
            const userId = socket.user._id.toString();
            if (!userSockets.has(userId)) userSockets.set(userId, new Set());
            userSockets.get(userId).add(socket.id);
            socket.join(userId); // personal room

            socket.on('chat:sendMessage', async (payload) => {
                // Prefer REST endpoint; this can be used for real-time only optional
                // Kept minimal to encourage using /chat/send POST
            });

            socket.on('chat:typing', ({ toUserId, conversationId }) => {
                io.to(toUserId).emit('chat:typing', { fromUserId: userId, conversationId });
            });

            socket.on('disconnect', () => {
                const set = userSockets.get(userId);
                if (set) {
                    set.delete(socket.id);
                    if (set.size === 0) userSockets.delete(userId);
                }
            });
        });

        server.listen(1234, () => {
            console.log("Server & Socket.IO running on port 1234");
        });
    })
    .catch((err)=>{
        console.log("Error connecting to database", err);
    });