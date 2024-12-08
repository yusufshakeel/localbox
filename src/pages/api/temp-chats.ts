import { Server } from 'socket.io';
import fs from 'fs-extra';
import path from 'path';
import {
  TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS,
  TEMP_CHATS_MESSAGES_FILE_PATH
} from '@/configs/temp-chats';

const messagesFile = path.join(process.cwd(), TEMP_CHATS_MESSAGES_FILE_PATH);

// Ensure the messages file exists
fs.ensureFileSync(messagesFile);
if (!fs.existsSync(messagesFile)) {
  fs.writeJSONSync(messagesFile, []);
}

// Remove expired messages
const cleanupExpiredMessages = () => {
  let messages;
  try {
    messages = fs.readJSONSync(messagesFile)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    messages = [];
  }
  const now = Date.now();
  const filteredMessages =
      messages.filter((msg: any) => now - msg.timestamp <= TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS);
  fs.writeJSONSync(messagesFile, filteredMessages);
};

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/temp-chats' // Custom Socket.IO path
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      // Send existing messages to the newly connected client
      cleanupExpiredMessages();
      let messages;
      try {
        messages = fs.readJSONSync(messagesFile)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        messages = [];
      }
      socket.emit('initialMessages', messages);

      // Handle new messages
      socket.on('sendMessage', (data) => {
        const now = Date.now();
        const newMessage = { ...data, timestamp: now };
        const messages = fs.readJSONSync(messagesFile);
        messages.push(newMessage);
        fs.writeJSONSync(messagesFile, messages);

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
