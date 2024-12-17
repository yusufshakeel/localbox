import Head from 'next/head';
import Image from 'next/image';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload, faImage} from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import ListDirectoryFilesComponent from '@/components/ListDirectoryFilesComponent';
import {useState} from 'react';
import {getFilename} from '@/utils/filename';

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
            <Col sm={12} lg={6} className="mb-5">
              <div className="img-thumbnail text-center" style={{width: '100%', minHeight: '300px'}}>
                {
                  selectedFile?.length && (
                    <div>
                      <Image
                        width={300}
                        height={300}
                        className="img-fluid ms-auto me-auto"
                        src={`/images/${encodeURIComponent(selectedFile)}`}
                        alt={selectedFile}/>
                      <p className="my-3">{getFilename(selectedFile)}</p>
                    </div>
                  )
                }
              </div>
              <div>
                {
                  selectedFile?.length && (
                    <a className="btn btn-outline-primary btn-sm"
                      href={`/images/${encodeURIComponent(selectedFile)}`} download>
                      Download <FontAwesomeIcon icon={faDownload}/>
                    </a>
                  )
                }
              </div>
            </Col>
            <Col sm={12} lg={6}>
              <ListDirectoryFilesComponent
                dir={'images'}
                actions={['viewImage', 'download']}
                actionHandlers={{viewImage: selectedFileHandler, click: selectedFileHandler}}
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
