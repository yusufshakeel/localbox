import Head from 'next/head';
import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFile, faImage, faInfo, faMusic, faUpload, faVideo} from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';

export default function Home() {
  const items = [
    {  icon: faUpload,  title: 'Uploads',  link: '/uploads'},
    {  icon: faVideo,  title: 'Videos',  link: '/videos'},
    {  icon: faMusic,  title: 'Audios',  link: '/audios'},
    {  icon: faImage,  title: 'Images',  link: '/images'},
    {  icon: faFile,  title: 'Documents',  link: '/documents'},
    {  icon: faInfo,  title: 'Info',  link: '/info'}
  ];

  const getItems = () => {
    return items.map((item, index) => {
      return (
        <Col sm={12} md={4} lg={3} key={index}>
          <Link className="ys-a-link" href={item.link}>
            <Card className="text-center m-3">
              <Card.Body>
                <Card.Title><FontAwesomeIcon size="3x" icon={item.icon}/></Card.Title>
                <Card.Text>{item.title}</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      );
    });
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1 className="display-1">Welcome to {WEBSITE_NAME}</h1>
            </Col>
          </Row>
          <Row className="my-5">
            {getItems()}
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
