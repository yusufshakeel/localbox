import {useEffect, useRef, useState} from 'react';
import {MessageType} from '@/hooks/temp-chats/useChattingEffect';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {getFilename} from '@/utils/filename';
import useWindowEffect from '@/hooks/useWindowEffect';
import {formatDate} from '@/utils/date';

export type PropType = {
  messages: MessageType[];
  currentUserId: string;
}

export default function ChatsComponent(props: PropType) {
  const messagesEndRef = useRef(null);
  const {viewportHeight} = useWindowEffect();
  const [chatContentHeight, setChatContentHeight] = useState<number>(300);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      // eslint-disable-next-line
      // @ts-ignore
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [props.messages]);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const body = document.body;
      const paddingTop = parseFloat(window.getComputedStyle(body).paddingTop);
      const chatHeader = document.getElementById('chat-header')?.offsetHeight ?? 0;
      const chatInput = document.getElementById('chat-input')?.offsetHeight ?? 0;
      const chatContent = viewportHeight - paddingTop - chatHeader - chatInput - 10;
      setChatContentHeight(chatContent);
    }
  }, [viewportHeight]);

  return (
    <div id="chat-content" ref={messagesEndRef} style={{ padding: '10px', height: `${chatContentHeight}px`, overflowY: 'scroll', borderRadius: '0'}}>
      {
        (props.messages || []).map((msg: MessageType, idx) => {
          const fileName = getFilename(msg.message);
          const message =
            msg.type === 'file'
              ? <div>
                <a className="ys-a-link" href={`/temp-chats/${encodeURIComponent(msg.message)}`} download>
                  {fileName} <FontAwesomeIcon icon={faDownload}/>
                </a>
              </div>
              : <span>{msg.message}</span>;

          let messagePreview: any = '';
          if (msg.type === 'file') {
            if (['jpg', 'jpeg', 'png'].includes(fileName.split('.')?.pop() ?? '')) {
              messagePreview = (
                <img src={`/temp-chats/${encodeURIComponent(msg.message)}`} className="img-fluid"
                  style={{maxHeight: '200px'}}/>
              );
            }
            else if (['mp4'].includes(fileName.split('.')?.pop() ?? '')) {
              messagePreview = (
                <video controls height="150px" key={msg.message}>
                  <source src={`/temp-chats/${encodeURIComponent(msg.message)}`}/>
                  Your browser does not support the video tag.
                </video>
              );
            }
            else if (['mp3'].includes(fileName.split('.')?.pop() ?? '')) {
              messagePreview = (
                <audio controls key={msg.message}>
                  <source src={`/temp-chats/${encodeURIComponent(msg.message)}`}/>
                  Your browser does not support the audio tag.
                </audio>
              );
            }
          }
          return (
            <div key={idx}
              style={{textAlign: msg.userId === props.currentUserId ? 'right' : 'left'}}>
              <div
                className={`${msg.userId === props.currentUserId ? 'bg-light' : ''} card mb-3 p-2`}
                style={{display: 'inline-block'}}>
                <div className="mb-1">
                  <strong>{msg.displayName} </strong>
                  <span
                    className="float-end ms-3"> <small>{formatDate(msg.timestamp)}</small></span>
                </div>
                <div className="mb-1" style={{wordBreak: 'break-word', overflowWrap: 'break-word'}}>
                  {messagePreview}
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