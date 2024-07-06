import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client'; // Import Socket.IO client

const Notify = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URI}/api/notifications/${userId}`);
                setNotifications(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_URI, {
            transports: ['websocket'],
            auth: {
                token: localStorage.getItem('token'),
            },
        });

        socket.on('notification', (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        notifications.forEach(notification => {
            const key = notification.sender;

            const customToast = (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge badgeContent={1} color="primary">
                        <MailIcon color="action" />
                    </Badge>
                    <span style={{ marginLeft: 10 }}>{notification.message}</span>
                </div>
            );

            toast.info(customToast, {
                autoClose: 5000,
                position: "top-right",
                toastId: key,
                onOpen: () => {
                    // Add a custom attribute to uniquely identify the toast
                    const toastElement = document.querySelector(`[data-toastid="${key}"]`);
                    if (toastElement) {
                        toastElement.setAttribute('data-key', key);
                    }
                },
            });
        });
    }, [notifications]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <ToastContainer />
        </>
    );
};

export default Notify;
