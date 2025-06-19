import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io';
import crypto from "crypto"
import { createTable, getMessages, insert } from './db.js';

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173']

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
})

let queue = []

io.on('connection', (socket) => {

  socket.on('find-partner', (username) => {
    if (queue.length) {
      let { username: partner, socket: partnerSocket } = queue.shift();
      let roomname = crypto.randomUUID().replace(/-/g, '');
      socket.join(roomname);
      partnerSocket.join(roomname);
      io.to(roomname).emit('find-partner', { username, partner, roomname });
    } else {
      queue.push({ username, socket });
    }
  });

  socket.on('chat-message', (data) => {
    insert(data.roomname, {username: data.username, message: data.message});
    io.to(data.roomname).emit('chat-message', data);
  });

  socket.on('get-messages', (roomname) => {
    io.to(roomname).emit('get-messages', getMessages(roomname));
  });

  socket.on('reconnect', roomname => {
    socket.join(roomname);
  })

})

server.listen(5000, () => {
  createTable();
  console.log('Server is running on port:' + 5000);
})