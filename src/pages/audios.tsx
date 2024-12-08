import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';
import {useState} from 'react';

export default function Audios() {
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
              <h1><FontAwesomeIcon icon={faMusic}/> Audios</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} md={8}>
              {
                selectedFile?.length
                  ? (
                    <audio className="mb-5" controls key={selectedFile}>
                      <source src={`/audios/${encodeURIComponent(selectedFile)}`}/>
                          Your browser does not support the audio tag.
                    </audio>
                  )
                  : ''
              }
              <ListDirectoryFilesComponent
                dir={'audios'}
                actions={['playAudio', 'download']}
                actionHandlers={{playAudio: selectedFileHandler}}
              />
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
