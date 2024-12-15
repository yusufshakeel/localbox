import {useEffect, useState} from 'react';
import io from 'socket.io-client';
import {getUUID} from '@/utils/uuid';

let socket: any;

export interface MessageBodyType {
  userId: string,
  displayName: string,
  message: string,
  type: 'text' | 'file',
}

export interface MessageType extends MessageBodyType {
  id: string,
  timestamp: number,
}

const useChattingEffect = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    // Connect to the custom backend route
    socket = io({
      path: '/api/temp-chats' // Custom Socket.IO path
    });

    socket.on('initialMessages', (msgs: MessageType[]) => {
      setMessages(msgs);
    });

    socket.on('newMessage', (msg: MessageType) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (messageBody: MessageBodyType): string => {
    const messageId = getUUID();
    socket.emit('sendMessage', {
      id: messageId,
      timestamp: Date.now(),
      ...messageBody
    });
    return messageId;
  };

  return {
    messages,
    sendMessage
  };
};

export default useChattingEffect;