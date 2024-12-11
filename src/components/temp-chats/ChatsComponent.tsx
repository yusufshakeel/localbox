import {useEffect, useRef} from 'react';
import {MessageType} from '@/effects/temp-chats/useChattingEffect';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {getFilename} from '@/utils/filename';

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
        (props.messages || []).map((msg: MessageType, idx) => {
          const message =
            msg.type === 'file'
              ? <a className="ys-a-link" href={`/temp-chats/${encodeURIComponent(msg.message)}`} download>
                {getFilename(msg.message)} <FontAwesomeIcon icon={faDownload}/>
              </a>
              : <span>{msg.message}</span>;
          return (
            <div key={idx}
              style={{textAlign: msg.userId === props.currentUserId ? 'right' : 'left'}}>
              <div
                className={`${msg.userId === props.currentUserId ? 'bg-light' : ''} card mb-3 p-2`}
                style={{display: 'inline-block'}}>
                <div className="mb-1">
                  <strong>{msg.displayName} </strong>
                  <span
                    className="float-end ms-3"> {new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <div className="mb-1" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                  {message}
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}