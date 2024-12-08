import {useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Form, Button, InputGroup, Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} from '@/configs/temp-chats';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';

let socket: any;

export default function TempChats() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

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
    if (name.trim()) {
      setIsConnected(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { name, message, type: 'text' });
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
  
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faMessage}/> TempChats</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} md={8} lg={8} className="mb-5">
              <div>
                {!isConnected ? (
                  <div>
                    <h3>Join Chat</h3>
                    <InputGroup>
                      <Form.Control
                        size="lg"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Button variant="primary" onClick={joinChat}>Join</Button>
                    </InputGroup>
                  </div>
                ) : (
                  <div>
                    <Card
                      ref={messagesEndRef}
                      style={{height: '300px', overflowY: 'scroll'}}>
                      <Card.Body>
                        {messages.map((msg: any, idx) => (
                          <div key={idx} className="card bg-light mb-3 p-2">
                            <div className="mb-1">
                              <strong>{msg.name} </strong>
                              <span className="float-end"> {new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="mb-1">{msg.message}</div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
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
                )}
              </div>
            </Col>
            <Col sm={12} md={4} lg={4} className="mb-5">
              <p><strong>Info</strong></p>
              <p>Messages get deleted
                after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</p>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
