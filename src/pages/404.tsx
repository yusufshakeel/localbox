import Head from 'next/head';
import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';

export default function PageNotFound() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1 className="display-1">Page not found</h1>
              <Link className="btn btn-primary btn-lg" href="/">Back to home</Link>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
