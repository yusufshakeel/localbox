import {useEffect, useState} from 'react';
import Head from 'next/head';
import Cookies from 'js-cookie';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Table, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import WithAuth from '@/components/WithAuth';
import {AuthPayload} from '@/types/auth-payload';
import useLogoutEffect from '@/hooks/auth/useLogoutEffect';
import showToast from '@/utils/show-toast';
import useRouter from 'next/router';

function ProfilePage() {
  const [accountDetails, setAccountDetails] = useState<AuthPayload>();
  const {handleLogout, error, response} = useLogoutEffect();

  useEffect(() => {
    try {
      const accountDetails = JSON.parse(Cookies.get('account_details') || '');
      if (accountDetails) {
        setAccountDetails(accountDetails);
      }
      // eslint-disable-next-line
    } catch (err: any) {
      // do nothing
    }
  }, []);

  useEffect(() => {
    const handleApiErrorAndResponse = async () => {
      if (error) {
        showToast({ content: error, type: 'error', autoClose: 1000 });
      }
      if (response?.message) {
        showToast({ content: response.message, type: 'success', autoClose: 2000 });
        await useRouter.push('/');
      }
    };
    handleApiErrorAndResponse();
  }, [error, response]);

  const logoutHandler = () => {
    handleLogout();
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row className="mb-3">
            <Col>
              <h1><FontAwesomeIcon icon={faUser}/> Profile</h1>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col sm={12} md={6}>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>{accountDetails?.username}</td>
                  </tr>
                  <tr>
                    <td>Account Type</td>
                    <td>{accountDetails?.accountType}</td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="secondary" onClick={logoutHandler}>Log Out</Button>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAuth(ProfilePage);