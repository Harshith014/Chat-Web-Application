/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import { ColorModeContext } from '../context/ThemeContext';
import '../css/Register.css';
import LoadingComponent from './Loading';

// Custom SVG components
const BackgroundSVG = () => (
    <svg className="absolute inset-0 z-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0099ff" fillOpacity="0.1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
);

const UserIcon = (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const EmailIcon = (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const LockIcon = (props) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

// Custom Input Component
const CustomInput = ({ icon: Icon, label, ...props }) => {
    const { mode } = useContext(ColorModeContext);

    return (
        <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
                <input
                    style={{ color: mode === 'dark' ? '#000' : '#333' }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    {...props}
                />
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
        </div>
    );
};

// Animated Button Component
const AnimatedButton = ({ children, ...props }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyles = useSpring({
        scale: isHovered ? 1.05 : 1,
        config: { tension: 300, friction: 10 },
    });

    return (
        <animated.button
            style={buttonStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            {...props}
        >
            {children}
        </animated.button>
    );
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { mode, toggleColorMode } = useContext(ColorModeContext);

    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setFormError('Please fill out all fields.');
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_URI}/api/auth/register`, formData);
            setFormData({
                username: "",
                email: "",
                password: "",
              });
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message) {
                setFormError(error.response.data.message);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                  });
            } else if (error.response?.data?.msg) {
                setFormError(error.response.data.msg);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                  });
            } else {
                setFormError('Registration failed. Please try again.');
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                  });
            }
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
            <BackgroundSVG />
            <animated.div style={fadeIn} className="z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-blue-600">Join ChatApp!</h1>
                    <p className="text-lg text-gray-600">Sign up to start chatting with your friends and family in real-time.</p>
                </div>
                <animated.div
                    style={{
                        ...fadeIn,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                    className="p-8"
                >
                    {isLoading ? (
                        <LoadingComponent />
                    ) : (
                        <>
                            {formError && (
                                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                                    <p className="text-red-600 text-sm">{formError}</p>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <CustomInput
                                    icon={UserIcon}
                                    name="username"
                                    label="Username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                />
                                <CustomInput
                                    icon={EmailIcon}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                                <CustomInput
                                    icon={LockIcon}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                />

                                <AnimatedButton type="submit">Register</AnimatedButton>
                            </form>
                        </>
                    )}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/login')}>
                                Login
                            </span>
                        </p>
                    </div>
                </animated.div>
            </animated.div>
            <button
                onClick={toggleColorMode}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
            >
                {mode === 'dark' ? '🌞' : '🌙'}
            </button>
        </div>
    );
};

export default Register;