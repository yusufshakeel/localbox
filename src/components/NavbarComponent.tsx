import { Navbar, Container, Nav } from 'react-bootstrap';
import Link from 'next/link';
import { WEBSITE_NAME } from '@/constants';
import {PAGES} from '@/configs/pages';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCloud} from '@fortawesome/free-solid-svg-icons';
import {useAppContext} from '@/context/AppContext';

export default function NavbarComponent() {
  const appContext = useAppContext();

  return (
    <Navbar expand="lg" bg={appContext.theme} fixed="top">
      <Container>
        <Navbar.Brand>
          <Nav.Link as={Link} href="/">{WEBSITE_NAME}</Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {
              PAGES.map((page, index) => {
                return (
                  <Nav.Link key={index} as={Link} href={page.link} className="me-4">
                    <FontAwesomeIcon icon={page.icon}/>
                    <span className="ms-2 d-md-none d-lg-none">{page.title}</span>
                  </Nav.Link>
                );
              })
            }
          </Nav>
          <Navbar.Text>
            <FontAwesomeIcon icon={faCloud}/>
            <span className="ms-2">{appContext.ip}:{appContext.port}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}