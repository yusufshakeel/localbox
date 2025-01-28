import { Server } from 'socket.io';
import fs from 'fs-extra';
import path from 'path';
import { TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS } from '@/configs/temp-chats';
import {Op} from 'minivium';
import {db, TempChatsMessagesCollectionName} from '@/configs/database/temp-chats-messages';
import {db as Configs, ConfigsCollectionName} from '@/configs/database/configs';
import {PublicFolder, PublicFolders} from '@/configs/folders';
import {getEpochTimestampInMilliseconds, getISOStringDate} from '@/utils/date';
import {hasApiPrivileges} from '@/services/api-service';
import {Pages} from '@/configs/pages';
import {PermissionsType} from '@/types/permissions';

const getMessageTTLInMilliseconds = async (): Promise<number> => {
  try {
    const configs = await Configs.query.selectAsync(
      ConfigsCollectionName,
      { where: { key: 'TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS' } }
    );

    if (configs.length === 1) {
      // eslint-disable-next-line
      console.log(
        `[temp-chats][getMessageTTLInMilliseconds] Fetched message TTL from config: ${configs[0].value} ms`
      );

      return configs[0].value;
    }

    // eslint-disable-next-line
    console.log(
      `[temp-chats][getMessageTTLInMilliseconds] No message TTL found in config. Using default message TTL: ${TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} ms`
    );

    return TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS;
  } catch (err: any) {
    // eslint-disable-next-line
    console.log(`[temp-chats][getMessageTTLInMilliseconds] Failed to get message TTL. Error: ${err.message}`);
    // eslint-disable-next-line
    console.log(`[temp-chats][getMessageTTLInMilliseconds] Using default message TTL. ${TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} ms`);

    return TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS;
  }
};

// Remove expired messages
const cleanupExpiredMessages = async (messageTTLInMilliseconds: number) => {
  try {
    const now = Date.now();
    const deletedMessagesCount = await db.query.deleteAsync(TempChatsMessagesCollectionName, {
      where: {timestamp: {[Op.lt]: now - messageTTLInMilliseconds}}
    });

    if (deletedMessagesCount === 0) {
      // eslint-disable-next-line
      console.log('[temp-chats][cleanupExpiredMessages] Nothing to delete.');
      return;
    }

    // eslint-disable-next-line
    console.log(`[temp-chats][cleanupExpiredMessages] Deleted messages: ${deletedMessagesCount}`);
  } catch (err: any) {
    // eslint-disable-next-line
    console.log(`[temp-chats][cleanupExpiredMessages] Failed to cleanup expired message. Error: ${err.message}`);
  }
};

// Remove older files
const cleanupOlderFiles = async (messageTTLInMilliseconds: number) => {
  try {
    const tempChatsDir = path.join(process.cwd(), PublicFolder, PublicFolders.tempChats);

    const now = Date.now();

    // Read all files in the directory
    const files = await fs.readdir(tempChatsDir);

    if (files.length === 0) {
      // eslint-disable-next-line
      console.log('[temp-chats][cleanupOlderFiles] Nothing to delete.');
      return;
    }

    // Filter files starting with the prefix and delete them
    for (const file of files) {
      const filePath = path.join(tempChatsDir, file as string);
      const stats = await fs.stat(filePath);
      const fileAgeInMilliseconds = now - getEpochTimestampInMilliseconds(stats.birthtime);
      if (fileAgeInMilliseconds > messageTTLInMilliseconds) {
        await fs.unlink(filePath);
        // eslint-disable-next-line
        console.log('[temp-chats][cleanupOlderFiles] Deleted file:', { file, filePath, birthtime: getISOStringDate(stats.birthtime) });
      }
    }
  } catch (err: any) {
    // eslint-disable-next-line
    console.log(`[temp-chats][cleanupOlderFiles] Failed to delete file: ${err}`);
  }
};

export default async function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/temp-chats' // Custom Socket.IO path
    });

    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      const messageTTLInMilliseconds = await getMessageTTLInMilliseconds();

      // Send existing messages to the newly connected client
      await cleanupExpiredMessages(messageTTLInMilliseconds);
      cleanupOlderFiles(messageTTLInMilliseconds); // fire and forget

      const session = await hasApiPrivileges(req, res, {
        allowedMethods: [],
        permissions: [
          `${Pages.tempChats.id}:${PermissionsType.AUTHORIZED_VIEW}`
        ]
      });
      if (!session) {
        io.emit('error', { error: 'You do not have permissions to view messages.' });
      } else {
        let messages;
        try {
          messages = await db.query.selectAsync(TempChatsMessagesCollectionName);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: any) {
          messages = [];
        }
        io.emit('initialMessages', messages);
      }

      // Handle new messages
      socket.on('sendMessage', async (data) => {
        const session = await hasApiPrivileges(req, res, {
          allowedMethods: [],
          permissions: [
            `${Pages.tempChats.id}:${PermissionsType.AUTHORIZED_USE}`
          ]
        });
        if (!session) {
          io.emit('error', { error: 'You do not have permissions to send messages.' });
          return;
        }

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