import { Server } from 'socket.io';
import fs from 'fs-extra';
import path from 'path';
import { TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS } from '@/configs/temp-chats';
import {Op} from 'minivium';
import {db, TempChatsMessagesCollectionName} from '@/configs/database/temp-chat-messages';
import {PublicFolder, PublicFolders} from '@/configs/folders';

// Remove expired messages
const cleanupExpiredMessages = async () => {
  const now = Date.now();
  await db.query.deleteAsync(TempChatsMessagesCollectionName, {
    where: { timestamp: { [Op.lt]: now - TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS } }
  });
};

// Remove older files
const cleanupOlderFiles = async () => {
  try {
    const tempChatsDir = path.join(process.cwd(), PublicFolder, PublicFolders.tempChats);

    const now = Date.now();

    // Read all files in the directory
    const files = await fs.readdir(tempChatsDir);

    // Filter files starting with the prefix and delete them
    for (const file of files) {
      const filePath = path.join(tempChatsDir, file as string);
      const stats = await fs.stat(filePath);
      if (now - new Date(stats.birthtime).getTime() > TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS) {
        await fs.unlink(filePath);
        // eslint-disable-next-line
        console.log('[temp-chats][cleanupOlderFiles] Deleted file:', { file, filePath, birthtime: new Date(stats.birthtime) });
      }
    }
  } catch (err: any) {
    // eslint-disable-next-line
    console.log(`Failed to delete file: ${err}`);
  }
};

export default async function handler(req: any, res: any) {
  await db.initAsync();

  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/temp-chats' // Custom Socket.IO path
    });

    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      // Send existing messages to the newly connected client
      await cleanupExpiredMessages();
      cleanupOlderFiles(); // fire and forget

      let messages;
      try {
        messages = await db.query.selectAsync(TempChatsMessagesCollectionName);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: any) {
        messages = [];
      }
      socket.emit('initialMessages', messages);

      // Handle new messages
      socket.on('sendMessage', async (data) => {
        const now = Date.now();
        const newMessage = { ...data, timestamp: now };
        await db.query.insertAsync(TempChatsMessagesCollectionName, { ...data, timestamp: now });

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