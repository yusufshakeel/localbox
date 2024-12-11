import Head from 'next/head';
import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import {pages} from '@/configs/pages';

export default function Home() {

  const getItems = () => {
    return pages.reduce((acc: any, item, index) => {
      if(item?.hideOnHomePage === true) {
        return acc;
      }
      return [
        ...acc,
        (
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
        )
      ];
    }, []);
  };

  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col className="text-center">
              <h1 className="display-1">Welcome to {WEBSITE_NAME}</h1>
              <p className="display-6">Your personal local cloud ☁️</p>
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
