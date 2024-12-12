import {useRef, useState} from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane, faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {MessageBodyType} from '@/effects/temp-chats/useChattingEffect';
import showToastHelper from '@/utils/show-toast';

export type PropType = {
  userId: string;
  displayName: string;
  sendMessage: (message: MessageBodyType) => void;
}

export default function InputComponent(props: PropType) {
  const [message, setMessage] = useState('');
  const inputFile = useRef<HTMLInputElement | null>(null);

  const sendHandler = () => {
    if (message.trim()) {
      props.sendMessage({ userId: props.userId, displayName: props.displayName, message, type: 'text' });
      setMessage('');
    }
  };

  const handleChange = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`/api/upload?dir=temp-chats`, {
          method: 'POST',
          body: formData
        });
        const json = await response.json();

        if (response.ok) {
          props.sendMessage({
            userId: props.userId,
            displayName: props.displayName,
            message: json.uploadedFileName,
            type: 'file'
          });
        } else {
          showToastHelper({
            content:'Failed to open file.',
            type: 'error'
          });
        }
      } catch (error: any) {
        showToastHelper({
          content: `Error uploading file: ${error.message}`,
          type: 'error'
        });
      }
    } catch (e: any) {
      showToastHelper({
        content:`Failed to open file. ${e.message}`,
        type: 'error'
      });
    }
  };

  return (
    <InputGroup id="chat-input">
      <Form.Control
        className="no-focus-border"
        as="textarea"
        rows={3}
        style={{resize: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0.3rem'}}
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="primary"
        onClick={sendHandler}>
        <FontAwesomeIcon icon={faPaperPlane}/> Send
      </Button>
      <Button
        variant="outline-secondary"
        onClick={() => inputFile.current && inputFile.current.click()}
        style={{borderTopRightRadius: '0', borderBottomRightRadius: '0.3rem'}}>
        <FontAwesomeIcon icon={faPaperclip}/>
      </Button>
      <input type='file'
        id='openFileButtonInputField'
        ref={inputFile}
        onChange={handleChange}
        onClick={event => {
          (event.target as HTMLInputElement).value = '';
        }}
        style={{display: 'none'}}/>
    </InputGroup>
  );
}