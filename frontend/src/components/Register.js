import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import { ColorModeContext } from '../context/ThemeContext';
import '../css/Register.css';
import Rain from './Homepage'; // Import the Rain component

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState('');

    const { mode, toggleColorMode } = useContext(ColorModeContext);

    const props = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field is empty
        if (!formData.username || !formData.email || !formData.password) {
            setFormError('Please fill out all fields.');
            return;
        }

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_URI}/api/auth/registe`, formData);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error(error.response.data);
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Rain />
            <animated.div style={{
                ...props,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            }}>
                <div className={`bg-blue-500 text-white p-4 rounded shadow-md mb-8 bluebox`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <Typography variant="h3" className="font-bold mb-2">Join ChatApp!</Typography>
                            <Typography variant="body1">Sign up to start chatting with your friends and family in real-time. Enjoy the best communication experience.</Typography>
                        </div>
                        <IconButton onClick={toggleColorMode} color="inherit">
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </div>
                </div>
                <animated.div style={props} className={`register-box p-8 rounded shadow-md ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Typography variant="h4" className={mode === 'dark' ? 'text-white' : ''}>Register</Typography>
                        <TextField
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ className: mode === 'dark' ? 'text-gray-300' : '' }}
                            InputProps={{
                                className: mode === 'dark' ? 'text-white dark-input' : '',
                            }}
                        />

                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ className: mode === 'dark' ? 'text-gray-300' : '' }}
                            InputProps={{
                                className: mode === 'dark' ? 'text-white dark-input' : '',
                            }}
                        />

                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ className: mode === 'dark' ? 'text-gray-300' : '' }}
                            InputProps={{
                                className: mode === 'dark' ? 'text-white dark-input' : '',
                            }}
                        />
                        {formError && <Typography variant="body2" className="text-red-500">{formError}</Typography>}
                        <Button type="submit" variant="contained" color="primary">
                            Register
                        </Button>
                    </form>
                    <div className="text-center mt-4">
                        <Typography className={mode === 'dark' ? 'text-gray-300' : ''}>Already have an account? <span className="text-blue-500 cursor-pointer" onClick={navigateToLogin}>Login <AiOutlineLogin /></span></Typography>
                    </div>
                </animated.div>
            </animated.div>
        </div>
    );
};

export default Register;
