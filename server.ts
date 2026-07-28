import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on('leaveGroup', (groupId) => {
      socket.leave(groupId);
      console.log(`Socket ${socket.id} left group ${groupId}`);
    });

    // Chat Events
    socket.on('sendMessage', (data) => {
      // Broadcast MessageCreated to all EXCEPT sender
      socket.to(data.groupId).emit('MessageCreated', data.message);
    });

    socket.on('startTyping', (data) => {
      socket.to(data.groupId).emit('TypingStarted', data);
    });

    socket.on('stopTyping', (data) => {
      socket.to(data.groupId).emit('TypingStopped', data);
    });
    
    // Group Events
    socket.on('createGroup', (data) => {
      // Broadcast to everyone so they can see the new group instantly
      socket.broadcast.emit('StudyGroupCreated', data);
    });

    socket.on('joinMember', (data) => {
      io.to(data.groupId).emit('MemberJoined', data);
    });

    socket.on('leaveMember', (data) => {
      io.to(data.groupId).emit('MemberLeft', data);
    });
    
    socket.on('createTask', (data) => {
      socket.to(data.groupId).emit('TaskCreated', data);
    });
    
    socket.on('uploadResource', (data) => {
      socket.to(data.groupId).emit('ResourceUploaded', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
