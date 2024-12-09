import {Button, Form, InputGroup} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {useState} from 'react';
import {MessageBodyType} from '@/pages/temp-chats/effects/useChattingEffect';

export type PropType = {
  userId: string;
  displayName: string;
  sendMessage: (message: MessageBodyType) => void;
}

export default function InputComponent(props: PropType) {
  const [message, setMessage] = useState('');

  const sendHandler = () => {
    if (message.trim()) {
      props.sendMessage({ userId: props.userId, displayName: props.displayName, message, type: 'text' });
      setMessage('');
    }
  };

  return (
    <InputGroup>
      <Form.Control
        size="lg"
        as="textarea"
        rows={3}
        style={{resize: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0.3rem'}}
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="primary"
        onClick={sendHandler}
        style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0.3rem'}}>
        <FontAwesomeIcon icon={faPaperPlane}/>
      </Button>
    </InputGroup>
  );
}