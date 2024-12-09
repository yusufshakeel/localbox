import {useState} from 'react';
import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Button, Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS} from '@/configs/temp-chats';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import useChattingEffect from '@/pages/temp-chats/effects/useChattingEffect';
import ChatsComponent from '@/pages/temp-chats/components/ChatsComponent';
import JoinChatComponent from '@/pages/temp-chats/components/JoinChatComponent';
import useUserAccountEffect from '@/pages/temp-chats/effects/useUserAccountEffect';
import MenuBarComponent from '@/pages/temp-chats/components/MenuBarComponent';
import InputComponent from '@/pages/temp-chats/components/InputComponent';
import DeleteAccountModalComponent from '@/pages/temp-chats/components/DeleteAccountModalComponent';

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
      <Card>
        <Card.Header>
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
            <Col>
              <h1><FontAwesomeIcon icon={faMessage}/> TempChats</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} md={8} lg={8}>
              {
                !isProfileCreated
                  ? <JoinChatComponent
                    displayName={displayName}
                    setDisplayName={setDisplayName}
                    joinChat={joinChat}/>
                  : messagesAreaComponent()
              }
              {
                isLoggedIn && (
                  <div className="my-5">
                    <Button variant="outline-danger"
                      onClick={() => setShowDeleteAccountModal(true)}>Delete Account</Button>
                  </div>
                )
              }
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <p><strong>Info</strong></p>
                <p>Messages are automatically deleted
                  after {TEMP_CHATS_MESSAGE_TTL_IN_MILLISECONDS / 60000} minutes.</p>
              </div>
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
