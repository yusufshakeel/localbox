import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import WithAuth from '@/components/WithAuth';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSliders} from '@fortawesome/free-solid-svg-icons';

function Admin() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faSliders}/> Admin Dashboard</h1>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAuth(Admin);