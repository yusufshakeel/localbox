import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';

export default function Images() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1 className="display-1"><FontAwesomeIcon icon={faImage}/> Images</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <ListDirectoryFilesComponent dir={'images'} actions={['download']}/>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
