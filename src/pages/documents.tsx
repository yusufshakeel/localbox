import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';
import WithAuth from '@/components/WithAuth';
import {AccountType} from '@/types/account-type';
import FileUploadComponent from '@/components/FileUploadComponent';

function DocumentsPage(props: any) {
  const { authAccountDetails } = props;
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faFile}/> Documents</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} lg={8}>
              {
                authAccountDetails.accountType === AccountType.admin &&
                <FileUploadComponent
                  accept="*"
                  dir="documents"
                />
              }
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} lg={12}>
              <ListDirectoryFilesComponent dir={'documents'} actions={['download']}/>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAuth(DocumentsPage);
