import { Navbar, Container, Nav } from 'react-bootstrap';
import Link from 'next/link';
import { WEBSITE_NAME } from '@/constants';
import useServeIpAddressEffect from '@/effects/useServeIpAddressEffect';
import {pages} from '@/configs/pages';

export default function NavbarComponent() {
  const {ip} = useServeIpAddressEffect();

  return (
    <Navbar expand="lg" bg="light" fixed="top">
      <Container>
        <Navbar.Brand>
          <Nav.Link as={Link} href="/">{WEBSITE_NAME}</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {
              pages.map((page, index) => {
                return <Nav.Link key={index} as={Link} href={page.link}>{page.title}</Nav.Link>;
              })
            }
          </Nav>
          <Navbar.Text>{ip}</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}