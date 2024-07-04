// Navbar.js
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
            <Toolbar>
                <Link to="/chat">Chat</Link>
                <Link to="/allusers">Users</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/home">Home</Link>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                {isLoggedIn ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button color="inherit" onClick={handleLogin}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
