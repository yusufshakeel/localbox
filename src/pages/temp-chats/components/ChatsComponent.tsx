import {useEffect, useRef} from 'react';
import {MessageType} from '@/pages/temp-chats/effects/useChattingEffect';

export type PropType = {
  messages: MessageType[];
  currentUserId: string;
}

export default function ChatsComponent(props: PropType) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      // eslint-disable-next-line
      // @ts-ignore
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [props.messages]);

  return (
    <div ref={messagesEndRef} style={{ padding: '10px', height: '300px', overflowY: 'scroll', borderRadius: '0'}}>
      {
        (props.messages || []).map((msg: MessageType, idx) => (
          <div key={idx}
            style={{ textAlign: msg.userId === props.currentUserId ? 'right' : 'left' }}>
            <div className={`${msg.userId === props.currentUserId ? 'bg-light': ''} card mb-3 p-2`} style={{display: 'inline-block'}}>
              <div className="mb-1">
                <strong>{msg.displayName} </strong>
                <span
                  className="float-end ms-3"> {new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <div className="mb-1" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                {msg.message}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}