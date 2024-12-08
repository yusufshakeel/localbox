import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faInfo} from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import useServeIpAddressEffect from '@/effects/useServeIpAddressEffect';

export default function Home() {
  const {ip} = useServeIpAddressEffect();
  
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faInfo}/> Info</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <h3>What is {WEBSITE_NAME}?</h3>
              <p>localbox is a simple application that acts as a file storage and
                sharing system for devices connected to a given network.</p>

              <h3>What are the use cases of this application?</h3>
              <p>Imagine you’re at home or in an office:</p>
              <ul>
                <li>You can quickly share files like photos, documents, or videos between
                  your phone and computer without using cloud services (e.g., Google
                  Drive or Dropbox).
                </li>
                <li>Any device on the same Wi-Fi network can interact with the Local Box
                  to upload files or retrieve hosted files.
                </li>
              </ul>

              <h3>Server Clients</h3>
              <p>The computer that is running this application will act like the server.
                A local IP address (like 192.168.0.151) will be displayed.
                Clients (other users) can connect to that IP address via browsers.</p>

              <img src="/assets/server-clients.png" className="img-fluid" style={{width: '500px'}} alt=""/>

              <h3>What is the server address?</h3>
              <p>{ip}</p>

              <h3>How to connect to the server?</h3>
              <p>If the server IP is 192.168.0.151 and is running at port 3001 then
                type <strong>http://192.168.0.151:3001</strong> in the browser.</p>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}
