import {useEffect} from 'react';
import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Table, Button, Badge} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import WithAuth from '@/components/WithAuth';
import useLogoutEffect from '@/hooks/auth/useLogoutEffect';
import showToast from '@/utils/show-toast';
import useRouter from 'next/router';
import Link from 'next/link';
import {AccountType} from '@/types/account-type';

function ProfilePage(props: any) {
  const {handleLogout, error, response} = useLogoutEffect();
  const { authAccountDetails } = props;

  useEffect(() => {
    const handleApiErrorAndResponse = async () => {
      if (error) {
        showToast({ content: error, type: 'error', autoClose: 1000 });
      }
      if (response?.message) {
        showToast({ content: response.message, type: 'success', autoClose: 1000 });
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
            <Col sm={12} md={12} lg={8}>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Id</td>
                    <td>{authAccountDetails.id}</td>
                  </tr>
                  <tr>
                    <td>Username</td>
                    <td>{authAccountDetails.username}</td>
                  </tr>
                  <tr>
                    <td>Account Type</td>
                    <td>{authAccountDetails.accountType}</td>
                  </tr>
                  <tr>
                    <td>Permissions</td>
                    <td>
                      {
                        authAccountDetails.rbac.permissions
                          .map((p: string) => <Badge key={p} bg="secondary" className="me-2">{p}</Badge>)
                      }
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Button variant="secondary" onClick={logoutHandler}>Log Out</Button>
              {
                authAccountDetails.accountType === AccountType.admin &&
                <Link href="/admins" className="btn btn-primary float-end">Admin Dashboard</Link>
              }
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAuth(ProfilePage);