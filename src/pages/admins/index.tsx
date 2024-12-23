import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import WithAdminAuth from '@/components/WithAdminAuth';

function Admin() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col className="text-center">
              <h1>Logged in</h1>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAdminAuth(Admin);