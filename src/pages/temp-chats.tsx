import {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import {v4 as uuidV4} from 'uuid';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Form, Button, InputGroup, Card, Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPaperPlane, faCircle } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import {
  TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS,
  TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME, TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH,
  TEMP_CHATS_MESSAGES_USER_ID, TEMP_CHATS_MESSAGES_USER_LOGGED_IN
} from '@/configs/temp-chats';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import {useAppContext} from '@/context/AppContext';

let socket: any;

export default function TempChats() {
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountText, setDeleteAccountText] = useState('');
  const [confirmDeleteAccountText, setConfirmDeleteAccountText] = useState('');
  const messagesEndRef = useRef(null);
  const {userPreferences, setUserPreferences} = useAppContext();

  const openDeleteAccountModalHandler = () => {
    setDeleteAccountText((Math.random()).toString().substring(2, 8));
    setShowDeleteAccountModal(true);
  }
  const closeDeleteAccountModalHandler = () => {
    setShowDeleteAccountModal(false);
  }
  const deleteAccountHandler = () => {
    if(confirmDeleteAccountText === deleteAccountText) {
      setUserPreferences({
        [TEMP_CHATS_MESSAGES_USER_ID]: null,
        [TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]: null,
        [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: null
      });
      setIsProfileCreated(false);
      setIsConnected(false);
      setIsLoggedIn(false);
      closeDeleteAccountModalHandler();
    }
  };

  useEffect(() => {
    if(userPreferences[TEMP_CHATS_MESSAGES_USER_ID]
      && userPreferences[TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]
    ) {
      setIsProfileCreated(true);
      setDisplayName(userPreferences[TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]);
      setUserId(userPreferences[TEMP_CHATS_MESSAGES_USER_ID]);

      if(userPreferences[TEMP_CHATS_MESSAGES_USER_LOGGED_IN]) {
        setIsLoggedIn(true);
        setIsConnected(true);
      }
    }
  }, [userPreferences]);

  useEffect(() => {
    // Connect to the custom backend route
    socket = io({
      path: '/api/temp-chats' // Custom Socket.IO path
    });

    socket.on('initialMessages', (msgs: any) => {
      setMessages(msgs);
    });

    socket.on('newMessage', (msg: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinChat = () => {
    if (displayName) {
      const id = uuidV4();
      setUserPreferences({
        [TEMP_CHATS_MESSAGES_USER_ID]: id,
        [TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]: displayName,
        [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: true
      });
      setIsProfileCreated(true);
      setUserId(id);
      setIsConnected(true);
      setIsLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { id: uuidV4(), userId, displayName, message, type: 'text' });
      setMessage('');
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      // eslint-disable-next-line
      // @ts-ignore
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const logOutUser = () => {
    setUserPreferences({
      [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: false
    });
    setIsLoggedIn(false);
  };

  const logInUser = () => {
    setUserPreferences({
      [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: true
    });
    setIsLoggedIn(true);
  }

  const profileActionForExistingUser = () => {
    return (
      <>
        <Button className="float-end" size="sm" variant="light" onClick={logOutUser}>Log Out</Button>
      </>
    );
  };

  const joinChatComponent = () => {
    return (
      <div>
        <h3>Join Chat</h3>
        <InputGroup>
          <Form.Control
            size="lg"
            type="text"
            maxLength={TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME_MAX_LENGTH}
            placeholder="Enter your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value.trim())}
          />
          <Button variant="primary" onClick={joinChat}>Join</Button>
        </InputGroup>
      </div>
    );
  };

  const messagesAreaComponent = () => {
    return (
      <div>
        <Card className="bg-light">
          <Card.Body>
            {
              isLoggedIn
                ? <span><FontAwesomeIcon icon={faCircle} style={{color: 'green'}}/> <strong>{displayName}</strong></span>
                : (
                  <>
                    <span><FontAwesomeIcon icon={faCircle} style={{color: 'red'}}/> <strong>{displayName}</strong>, you are currently logged out.</span>
                    <Button variant="light" size="sm" className="float-end" onClick={logInUser}>Join Back</Button>
                  </>
                )
            }
            {
              isProfileCreated && isLoggedIn
                ? profileActionForExistingUser()
                : ''
            }
          </Card.Body>
        </Card>
        {
          !isLoggedIn
            ? ''
            : (
              <>
                <Card
                  ref={messagesEndRef}
                  style={{height: '300px', overflowY: 'scroll'}}>
                  <Card.Body>
                    {messages.map((msg: any, idx) => (
                      <div key={idx}
                        style={{ textAlign: msg.userId === userId ? 'right' : 'left' }}>
                        <div className={`${msg.userId === userId ? 'bg-light': ''} card mb-3 p-2`} style={{display: 'inline-block'}}>
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
                    ))}
                  </Card.Body>
                </Card>
                <div className="mb-5">
                  <InputGroup>
                    <Form.Control
                      size="lg"
                      as="textarea"
                      rows={3}
                      style={{resize: 'none'}}
                      placeholder="Enter message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button variant="primary" onClick={sendMessage}>
                      <FontAwesomeIcon icon={faPaperPlane}/>
                    </Button>
                  </InputGroup>
                </div>
              </>
            )
        }
        {
          isProfileCreated && isLoggedIn
            ? <div>
              <Button variant="outline-danger" onClick={openDeleteAccountModalHandler}>Delete Account</Button>
            </div>
            : ''
        }
      </div>
    );
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title: WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faMessage}/> TempChats</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} md={8} lg={8} className="mb-5">
              { !isConnected && !isProfileCreated ? joinChatComponent() : messagesAreaComponent() }
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <div>
                <p><strong>Info</strong></p>
                <p>Messages are automatically deleted
                  after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</p>
              </div>
            </Col>
          </Row>
        </Container>
        <Modal show={showDeleteAccountModal} onHide={closeDeleteAccountModalHandler}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Account?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You are about to delete your account. This is an irreversible action.</p>
            <p>Type <strong>{deleteAccountText}</strong> to continue.</p>
            <Form.Control
              as="input"
              onChange={(e) => setConfirmDeleteAccountText(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger"
              onClick={deleteAccountHandler}
              disabled={confirmDeleteAccountText !== deleteAccountText}>
              Yes, delete my account.
            </Button>
            <Button variant="secondary" onClick={closeDeleteAccountModalHandler}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </BaseLayout>
    </>
  );
}
