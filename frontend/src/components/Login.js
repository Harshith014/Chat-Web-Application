import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import { ColorModeContext } from '../context/ThemeContext';
import '../css/Login.css'; // Make sure to create this CSS file
import LoadingComponent from './Loading';

// Custom SVG components
const BackgroundSVG = () => (
    <svg className="background-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#0099ff" fillOpacity="0.1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
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
        <div className="custom-input">
            <label>{label}</label>
            <div className="input-wrapper">
                <input
                    style={{ color: mode === 'dark' ? '#000' : '#333' }}
                    {...props}
                />
                <Icon className="input-icon" />
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
            className="animated-button"
            {...props}
        >
            {children}
        </animated.button>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
        if (!formData.email || !formData.password) {
            setFormError('Please fill out all fields.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_URI}/api/auth/login`, formData);
            localStorage.setItem('token', response.data.token);
            setFormData({
                email: "",
                password: "",
              });
            navigate('/chat');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                setFormError(error.response.data.message);
                setFormData({
                    email: "",
                    password: "",
                  });
            } else {
                setFormError('An error occurred. Please try again.');
                setFormData({
                    email: "",
                    password: "",
                  });
            }
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className={`login-container ${mode === 'dark' ? 'dark' : ''}`}>
            <BackgroundSVG />
            <animated.div style={fadeIn} className="login-content">
                <div className="bluebox">
                    <h3>Welcome to ChatApp!</h3>
                    <p>Connect with your friends and family in real-time. Experience seamless communication like never before.</p>
                </div>
                <animated.div style={fadeIn} className={`login-box ${mode === 'dark' ? 'dark' : ''}`}>
                    {isLoading ? ( // Conditionally render LoadingComponent
                        <LoadingComponent /> // Show loading indicator while fetching data
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h4>Login</h4>
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
                            {formError && <p className="error-message">{formError}</p>}
                            <AnimatedButton type="submit">Login</AnimatedButton>
                        </form>
                    )}
                    <div className="register-link">
                        <p>
                            No account?{' '}
                            <span onClick={() => navigate('/register')}>Register</span>
                        </p>
                    </div>
                </animated.div>
            </animated.div>
            <button onClick={toggleColorMode} className="theme-toggle">
                {mode === 'dark' ? '🌞' : '🌙'}
            </button>
        </div>
    );
};


export default Login;