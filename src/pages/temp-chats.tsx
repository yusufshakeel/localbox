import {useState} from 'react';
import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Card, Dropdown} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} from '@/configs/temp-chats';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import useChattingEffect from '@/hooks/temp-chats/useChattingEffect';
import ChatsComponent from '@/components/temp-chats/ChatsComponent';
import JoinChatComponent from '@/components/temp-chats/JoinChatComponent';
import useUserAccountEffect from '@/hooks/temp-chats/useUserAccountEffect';
import MenuBarComponent from '@/components/temp-chats/MenuBarComponent';
import InputComponent from '@/components/temp-chats/InputComponent';
import DeleteAccountModalComponent from '@/components/temp-chats/DeleteAccountModalComponent';

export default function TempChats() {
  const {messages, sendMessage} = useChattingEffect();
  const {
    displayName,
    setDisplayName,
    joinChat,
    logIn,
    logOut,
    isLoggedIn,
    userId,
    isProfileCreated,
    deleteAccount
  } = useUserAccountEffect();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const messagesAreaComponent = () => {
    return (
      <Card id="chat-container">
        <Card.Header id="chat-header">
          <MenuBarComponent
            isLoggedIn={isLoggedIn}
            displayName={displayName}
            logOut={logOut}
            logIn={logIn}/>
        </Card.Header>
        <Card.Body style={{ padding: '0' }}>
          {
            isLoggedIn
            && (
              <>
                <ChatsComponent messages={messages} currentUserId={userId}/>
                <InputComponent userId={userId} displayName={displayName}
                  sendMessage={sendMessage}/>
              </>
            )
          }
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title: WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col sm={12} md={8} lg={8} className="mb-5">
              {
                !isProfileCreated
                  ? <JoinChatComponent
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    joinChat={joinChat}/>
                  : messagesAreaComponent()
              }
            </Col>
            <Col sm={12} md={4} lg={4}>
              <h1><FontAwesomeIcon icon={faMessage}/> TempChats</h1>
              <div className="my-5">
                <p><strong>Info</strong></p>
                <p>Messages are automatically deleted
                  after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</p>
                <p>Files are automatically deleted
                  after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</p>
              </div>
              {
                isLoggedIn && (
                  <Dropdown>
                    <Dropdown.Toggle variant="light">Settings</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setShowDeleteAccountModal(true)}>
                        Delete Account
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
              }
            </Col>
          </Row>
        </Container>
        <DeleteAccountModalComponent
          showModal={showDeleteAccountModal}
          setShowModal={setShowDeleteAccountModal}
          deleteAccount={deleteAccount}/>
      </BaseLayout>
    </>
  );
}
