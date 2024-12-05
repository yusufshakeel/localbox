import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import FileUploadComponent from '@/components/FileUploadComponent';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';

export default function Uploads() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1 className="display-1"><FontAwesomeIcon icon={faUpload}/> Uploads</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <FileUploadComponent/>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <ListDirectoryFilesComponent dir={'uploads'} actions={['download']}/>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
