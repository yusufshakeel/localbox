import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';

export default function Audios() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1 className="display-1"><FontAwesomeIcon icon={faMusic}/> Audios</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <ListDirectoryFilesComponent dir={'audios'} actions={['listen', 'download']}/>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
