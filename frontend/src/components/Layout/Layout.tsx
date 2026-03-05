import { type FC } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';

const Layout: FC = () => (
  <>
    <Navbar bg="dark" variant="dark" expand="md" className="mb-0">
      <Container fluid className="px-4">
        <Navbar.Brand as={NavLink} to="/">
          SDDTest
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav>
            <Nav.Link as={NavLink} to="/companies">
              Companies
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;
