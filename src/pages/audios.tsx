import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';
import {useState} from 'react';
import {getFilename} from '@/utils/filename';

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
          <Row className="mt-5">
            <Col sm={12} lg={12}>
              {
                selectedFile?.length
                  ? (
                    <div className="mb-5">
                      <audio style={{width: '100%'}} controls key={selectedFile}
                        autoPlay={true}>
                        <source src={`/audios/${encodeURIComponent(selectedFile)}`}/>
                        Your browser does not support the audio tag.
                      </audio>
                      <p className="my-3">{getFilename(selectedFile)}</p>
                    </div>
                  )
                  : <audio className="mb-5" style={{width: '100%'}} controls key={selectedFile}>
                    <source src={''}/>
                    Your browser does not support the audio tag.
                  </audio>
              }
            </Col>
            <Col sm={12} lg={12}>
              <ListDirectoryFilesComponent
                dir={'audios'}
                actions={['playAudio', 'download']}
                actionHandlers={{playAudio: selectedFileHandler, click: selectedFileHandler}}
                hasFixedHeight={400}
                viewIn={'list'}
              />
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
