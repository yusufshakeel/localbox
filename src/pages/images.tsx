import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';
import {useState} from 'react';

export default function Images() {
  const [selectedFile, setSelectedFile] = useState<string|null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };
  
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faImage}/> Images</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} md={8} className="mb-5">
              <ListDirectoryFilesComponent
                dir={'images'}
                actions={['viewImage', 'download']}
                actionHandlers={{viewImage: selectedFileHandler}}
                hasFixedHeight={400}
              />
            </Col>
            <Col sm={12} md={4} className="mb-5">
              {
                selectedFile?.length
                  ? (
                    <img
                      className="img-fluid ms-auto me-auto"
                      style={{maxHeight: '400px'}}
                      src={`/images/${encodeURIComponent(selectedFile)}`}
                      alt={selectedFile}/>
                  )
                  : ''
              }
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
