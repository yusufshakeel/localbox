import {useState} from 'react';
import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';
import {getFilename} from '@/utils/filename';

export default function Videos() {
  const [selectedFile, setSelectedFile] = useState<string|null>(null);

  const selectedFileHandler = (file: string) => {
    if (file.length) {
      setSelectedFile(file);
    }
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title: WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faVideo}/> Videos</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col sm={12} lg={8}>
              {
                selectedFile?.length
                  ? (
                    <div className="mb-5">
                      <video controls width="100%" key={selectedFile}
                        autoPlay={true}>
                        <source src={`/videos/${encodeURIComponent(selectedFile)}`}/>
                        Your browser does not support the video tag.
                      </video>
                      <p className="my-3">{getFilename(selectedFile)}</p>
                    </div>
                  )
                  : <video className="mb-5" controls width="100%" key={selectedFile}>
                    <source src=""/>
                    Your browser does not support the video tag.
                  </video>
              }
            </Col>
            <Col sm={12} lg={4}>
              <ListDirectoryFilesComponent
                dir={'videos'}
                actions={['playVideo', 'download']}
                actionHandlers={{playVideo: selectedFileHandler, click: selectedFileHandler}}
                viewIn={'list'}
                hasFixedHeight={400}
              />
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
