const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Room-wise user tracking
const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!rooms[room]) rooms[room] = [];
    rooms[room].push(socket.username);

    io.to(room).emit('userList', rooms[room]);
  });

  socket.on('draw', (data) => {
    socket.to(socket.room).emit('draw', data);
  });

  socket.on('clear', () => {
    io.to(socket.room).emit('clear');
  });

  socket.on('disconnect', () => {
    const room = socket.room;
    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter(name => name !== socket.username);
      io.to(room).emit('userList', rooms[room]);
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
