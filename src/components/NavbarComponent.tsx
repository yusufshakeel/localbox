import { Navbar, Container, Nav } from 'react-bootstrap';
import Link from 'next/link';
import { WEBSITE_NAME } from '@/constants';
import {useEffect, useState} from 'react';

export default function NavbarComponent() {
  const [ip, setIp] = useState<string>('Loading...');

  useEffect(() => {
    const fetchIp = async () => {
      const response = await fetch('/api/ip');
      const data = await response.json();
      setIp(data.ip);
    };
    fetchIp();
  }, []);

  return (
    <Navbar expand="lg" bg="light" fixed="top">
      <Container>
        <Navbar.Brand>
          <Nav.Link as={Link} href="/">{WEBSITE_NAME}</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
          </Nav>
          <Navbar.Text>{ip}</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}