import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function TopNav() {
    return (
        <Navbar className='lato-bold'>
            <Container className='bg-degr'>
                <img src="/logo_min.png" alt="Logo" height={60} width={85} className='my-2 me-2' />
                <Navbar.Brand as={Link} to="/" className='fs-5'>Recetarium</Navbar.Brand>
                <Nav className="ms-auto me-3 fs-6">
                    <Nav.Item>
                        <Link to="/" className="nav-link">Inicio</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/about" className="nav-link">Sobre Nosotros</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/foro" className="nav-link">Foro</Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default TopNav;