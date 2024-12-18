import Head from 'next/head';
import Image from 'next/image';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Table} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import {useAppContext} from '@/context/AppContext';

export default function Home() {
  const {ip, port, localServerAddress, info} = useAppContext();
  
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faCircleInfo}/> Info</h1>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{info?.name}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{info?.description}</td>
                  </tr>
                  <tr>
                    <td>Version</td>
                    <td>{info?.version}</td>
                  </tr>
                  <tr>
                    <td>Author</td>
                    <td>{info?.author}</td>
                  </tr>
                  <tr>
                    <td>GitHub</td>
                    <td>
                      <a className="ys-a-link" href={info?.homepage}>{info?.homepage}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>License</td>
                    <td><a className="ys-a-link" href={info?.licensePage}>{info?.license}</a></td>
                  </tr>
                  <tr>
                    <td>Local Server IP</td>
                    <td>{ip}</td>
                  </tr>
                  <tr>
                    <td>Local Server Port</td>
                    <td>{port}</td>
                  </tr>
                  <tr>
                    <td>Local Server Address</td>
                    <td><a className="ys-a-link" href={localServerAddress}>{localServerAddress}</a>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <h2>FAQ</h2>
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

              <Image src="/assets/server-clients.png?v=1"
                className="img-fluid my-3"
                width={300}
                height={300}
                alt=""/>

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
