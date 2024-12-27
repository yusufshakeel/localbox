import {useEffect, useState} from 'react';
import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import {Button, Card, Col, Container, Form, Row} from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import {AUTH_USERNAME_MAX_LENGTH} from '@/configs/auth';
import useLogInEffect from '@/hooks/auth/useLogInEffect';
import {AccountType} from '@/types/account-type';
import showToast from '@/utils/show-toast';
import WithAdminAuth from '@/components/WithAdminAuth';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {error, handleLogin} = useLogInEffect();

  useEffect(() => {
    if(error) {
      showToast({content: error, type: 'error'});
    }
  }, [error]);

  const loginHandler = async (e: any) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    await handleLogin({username, password, accountType: AccountType.admin});
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col className="my-5">
              <div className="text-center">
                <Card className="d-inline-block shadow-sm">
                  <Card.Body>
                    <h3><code>admin portal</code></h3>
                    <Form onSubmit={loginHandler}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          className="no-focus-border"
                          type="text"
                          maxLength={AUTH_USERNAME_MAX_LENGTH}
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.trim())}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control
                          className="no-focus-border"
                          type="password"
                          maxLength={64}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value.trim())}
                          required
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">Log In</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAdminAuth(LoginPage);