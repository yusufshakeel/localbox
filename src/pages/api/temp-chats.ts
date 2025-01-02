import { Server } from 'socket.io';
import fs from 'fs-extra';
import path from 'path';
import {
  TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS,
  TEMP_CHATS_MESSAGES_FILENAME
} from '@/configs/temp-chats';
import {Op} from 'minivium';
import {db} from '@/configs/database/temp-chat-messages';

// Remove expired messages
const cleanupExpiredMessages = () => {
  const now = Date.now();
  db.query.delete(TEMP_CHATS_MESSAGES_FILENAME, {
    where: { timestamp: { [Op.lt]: now - TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS } }
  });
};

// Remove older files
const cleanupOlderFiles = () => {
  try {
    const tempChatsDir = path.join(process.cwd(), 'public', 'temp-chats');

    const now = Date.now();

    // Read all files in the directory
    const files = fs.readdirSync(tempChatsDir);

    // Filter files starting with the prefix and delete them
    files.forEach((file) => {
      const filePath = path.join(tempChatsDir, file as string);
      const stats = fs.statSync(filePath);
      if (now - new Date(stats.birthtime).getTime() > TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS) {
        fs.unlinkSync(filePath);
        // eslint-disable-next-line
        console.log('Deleted file:', { file, filePath, birthtime: new Date(stats.birthtime) });
      }
    });
  } catch (err: any) {
    // eslint-disable-next-line
    console.log(`Failed to delete file: ${err}`);
  }
};

export default function handler(req: any, res: any) {
  db.init();

  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/temp-chats' // Custom Socket.IO path
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      // Send existing messages to the newly connected client
      cleanupExpiredMessages();
      cleanupOlderFiles();
      let messages;
      try {
        messages = db.query.select(TEMP_CHATS_MESSAGES_FILENAME);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        messages = [];
      }
      socket.emit('initialMessages', messages);

      // Handle new messages
      socket.on('sendMessage', (data) => {
        const now = Date.now();
        const newMessage = { ...data, timestamp: now };
        db.query.insert(TEMP_CHATS_MESSAGES_FILENAME, { ...data, timestamp: now });

        // Broadcast the message to all clients
        io.emit('newMessage', newMessage);
      });

      socket.on('disconnect', () => {
        // eslint-disable-next-line
        console.log('A user disconnected');
      });
    });
  }

  res.end();
}