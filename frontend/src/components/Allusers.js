import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getUserIdFromToken } from '../utils/Auth';

const Allusers = ({ handleUserClick = () => { }, selectedUser }) => {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': token,
        }
    };

    const chatbotUser = {
        _id: 'chatbot',
        username: 'AI Chatbot'
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, config);
                setUsers([chatbotUser, ...response.data]);
                setLoading(false);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-4">Error: {error}</div>;
    }

    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden ${theme.palette.mode === 'dark' ? 'dark-mode' : 'light-mode'}`}
            style={{
                outline: `2px solid ${theme.palette.mode === 'dark' ? '#333' : '#ccc'}`, height: '44rem', backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
                // Add responsive styles
                maxWidth: '100%',
                maxHeight: '100vh',
                overflowY: 'auto',
                padding: '1rem',
                [theme.breakpoints.down('md')]: {
                    height: '36rem',
                    padding: '0.5rem',
                },
                [theme.breakpoints.down('sm')]: {
                    height: '28rem',
                    padding: '0.25rem',
                },
                [theme.breakpoints.down('xs')]: {
                    height: '20rem',
                    padding: '0.1rem',
                },
            }}>
            <h1 className={`text-xl font-bold py-4 px-6 ${theme.palette.mode === 'dark' ? 'bg-black text-white' : 'bg-gray-200'}`} style={{
                outline: 'none',
                fontSize: '1.25rem',
                [theme.breakpoints.down('md')]: {
                    fontSize: '1rem',
                },
                [theme.breakpoints.down('sm')]: {
                    fontSize: '0.875rem',
                },
                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.75rem',
                },
            }}>All Users</h1>
            <ul style={{
                overflowY: 'auto',
                maxHeight: 'calc(100% - 3rem)',
                padding: '0',
                [theme.breakpoints.down('md')]: {
                    maxHeight: 'calc(100% - 2rem)',
                },
                [theme.breakpoints.down('sm')]: {
                    maxHeight: 'calc(100% - 1.5rem)',
                },
                [theme.breakpoints.down('xs')]: {
                    maxHeight: 'calc(100% - 1rem)',
                },
            }}>
                {users.map(user => (
                    <li
                        key={user._id}
                        onClick={() => handleUserClick(user._id, user.username)}
                        className={`flex items-center justify-between px-6 py-3 cursor-pointer ${user._id === selectedUser ? 'bg-blue-300' : theme.palette.mode === 'dark' ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}
                        style={{
                            outline: `1px solid ${theme.palette.mode === 'dark' ? '#555' : '#ddd'}`,
                            padding: '0.5rem',
                            [theme.breakpoints.down('md')]: {
                                padding: '0.25rem',
                            },
                            [theme.breakpoints.down('sm')]: {
                                padding: '0.1rem',
                            },
                            [theme.breakpoints.down('xs')]: {
                                padding: '0.05rem',
                            },
                        }}
                    >
                        <div className="flex items-center">
                            <div className="rounded-full bg-gray-300 w-10 h-10 flex items-center justify-center text-gray-600">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                                <div className="font-medium">{user.username}</div>
                                {user.email && <div className="text-gray-600 text-sm">{user.email}</div>}
                            </div>
                        </div>
                        {user._id === selectedUser && (
                            <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

Allusers.propTypes = {
    handleUserClick: PropTypes.func,
    selectedUser: PropTypes.string,
};

export default Allusers;
