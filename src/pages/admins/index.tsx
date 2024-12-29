import Head from 'next/head';
import BaseLayout from '@/layouts/BaseLayout';
import {Container, Row, Col, Tabs, Tab} from 'react-bootstrap';
import {WEBSITE_NAME} from '@/constants';
import htmlHeadContentHelper from '@/helpers/html-head-content-helper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSliders} from '@fortawesome/free-solid-svg-icons';
import CreateUserModalComponent from '@/components/admin/CreateUserModalComponent';
import ListUsersComponent from '@/components/admin/ListUsersComponent';
import WithAdminAuth from '@/components/WithAdminAuth';
import ListPagesComponent from '@/components/admin/ListPagesComponent';

function Admin() {
  return (
    <>
      <Head>{htmlHeadContentHelper({title:WEBSITE_NAME})}</Head>
      <BaseLayout>
        <Container>
          <Row>
            <Col>
              <h1><FontAwesomeIcon icon={faSliders}/> Admin Dashboard</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <Tabs
                defaultActiveKey="users"
              >
                <Tab eventKey="users" title="Users">
                  <Row>
                    <Col className="my-3">
                      <h3>Users <div className="float-end"><CreateUserModalComponent/></div></h3>
                      <ListUsersComponent/>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="page-permissions" title="Page Permissions">
                  <Row>
                    <Col className="my-3">
                      <h3>Page Permissions</h3>
                      <ListPagesComponent/>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </BaseLayout>
    </>
  );
}

export default WithAdminAuth(Admin);