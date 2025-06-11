import { useNavigate, Outlet } from 'react-router-dom';
import {AuthService} from "../../auth/services/auth.service";
import {Button, Container, Navbar} from "react-bootstrap";
import React from "react";

function AppNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.removeToken();
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: '#f6f4ec', minHeight: '100vh' }}>
            <Navbar style={{ backgroundColor: '#f6f4ec' }} expand="lg">
                <Container className={"me-0"}>
                    <Button
                        variant="danger"
                        className="ms-auto"
                        onClick={handleLogout}
                        style={{
                            borderRadius: '20px',
                            padding: '5px 20px',
                        }}
                    >
                        Logout
                    </Button>
                </Container>
            </Navbar>
            <Outlet />
        </div>
    );
}

export default AppNavbar;