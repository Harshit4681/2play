const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://192.168.1.9:3000','http://localhost:3002'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'] // Force WebSocket only
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const roomStates = {};

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    
    if (!roomStates[roomId]) {
      roomStates[roomId] = {
        currentSong: null,
        isPlaying: false,
        currentTime: 0
      };
    }
    
    // Send current state to new member
    socket.emit('sync-state', roomStates[roomId]);
  });

  socket.on('play', ({ roomId, song, time }) => {
    roomStates[roomId] = {
      currentSong: song,
      isPlaying: true,
      currentTime: time
    };
    socket.to(roomId).emit('play', { song, time });
  });

  socket.on('pause', ({ roomId, time }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].isPlaying = false;
      roomStates[roomId].currentTime = time;
    }
    socket.to(roomId).emit('pause', { time });
  });

  socket.on('time-update', ({ roomId, time }) => {
    if (roomStates[roomId]) {
      roomStates[roomId].currentTime = time;
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🎧 Server running on port 3000');
});