import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';

export default function Home() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col className="text-center">
              <h1 className="display-1">Welcome to {WEBSITE_NAME}</h1>
              <p className="display-6">Your personal local cloud ☁️</p>
              <h3><code>admin portal</code></h3>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
