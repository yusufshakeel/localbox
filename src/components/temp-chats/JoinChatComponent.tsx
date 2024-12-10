import {Button, Card, Form} from 'react-bootstrap';
import {TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH} from '@/configs/temp-chats';

export type PropType = {
  displayName: string;
  setDisplayName: (displayName: string) => void;
  joinChat: () => void;
}

export default function JoinChatComponent(props: PropType) {
  return (
    <div className="text-center">
      <Card className="d-inline-block shadow-sm">
        <Card.Body>
          <h3>Join Chat</h3>
          <Form.Group className="mb-3" controlId="userDisplayName">
            <Form.Control
              className="no-focus-border"
              type="text"
              maxLength={TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH}
              placeholder="Set your display name"
              value={props.displayName}
              onChange={(e) => props.setDisplayName(e.target.value.trim())}
            />
            <Form.Text className="text-muted">
              This cannot be changed later.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={props.joinChat}>Join</Button>
        </Card.Body>
      </Card>
    </div>
  );
}