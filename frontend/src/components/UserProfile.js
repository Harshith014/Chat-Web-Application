import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Avatar, Box, Button, Container, Grid, Paper, Skeleton, TextField, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/UserProfile.css';
import { getUserIdFromToken } from '../utils/Auth';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.primary,
    background: theme.palette.mode === 'dark' ? '#333' : '#f8f9fa',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[10],
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    margin: '0 auto',
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 20px ${theme.palette.primary.main}`,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({ username: '', email: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editing, setEditing] = useState(false);
    const theme = useTheme();

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': token,
        }
    };

    useEffect(() => {
        const userId = getUserIdFromToken();

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, config);
                setUserProfile(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Server error');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [token]);

    const handleChange = (e) => {
        if (e.target.name === 'avatar') {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create a preview URL for the selected image
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        } else {
            setUserProfile({
                ...userProfile,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserIdFromToken();

        const formData = new FormData();
        formData.append('username', userProfile.username);
        formData.append('email', userProfile.email);
        if (file) {
            formData.append('avatar', file);
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, formData, config);
            setUserProfile(response.data);
            setMessage('Profile updated successfully');
            setEditing(false);
            setPreviewUrl(null); // Clear the preview after successful update
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Server error');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <StyledPaper elevation={3}>
                    <Skeleton variant="circular" width={150} height={150} sx={{ margin: '0 auto' }} />
                    <Skeleton variant="text" width="60%" sx={{ margin: '20px auto' }} />
                    <Skeleton variant="text" width="40%" sx={{ margin: '10px auto' }} />
                </StyledPaper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <StyledPaper elevation={3}>
                    <Typography variant="h6" color="error">Error: {error}</Typography>
                </StyledPaper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <StyledPaper elevation={3}>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <StyledAvatar
                            src={previewUrl || (userProfile.avatar ? `http://localhost:5000${userProfile.avatar}` : null)}
                            alt={userProfile.username}
                        >
                            {!previewUrl && !userProfile.avatar && <AccountCircleIcon fontSize="large" />}
                        </StyledAvatar>
                        <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                            {userProfile.username}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                            {userProfile.email}
                        </Typography>
                        {!editing && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => setEditing(true)}
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Grid>
                    {editing && (
                        <Grid item xs={12} md={6}>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    value={userProfile.username}
                                    onChange={handleChange}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={userProfile.email}
                                    onChange={handleChange}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={handleChange}
                                    name="avatar"
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="outlined" component="span" fullWidth sx={{ mt: 2, mb: 2 }}>
                                        Upload New Avatar
                                    </Button>
                                </label>
                                {previewUrl && (
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <Typography variant="subtitle1">Preview:</Typography>
                                        <Avatar
                                            src={previewUrl}
                                            alt="Avatar preview"
                                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                                        />
                                    </Box>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<CancelIcon />}
                                    onClick={() => {
                                        setEditing(false);
                                        setPreviewUrl(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
                {message && (
                    <Typography variant="body1" sx={{ color: 'success.main', mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </StyledPaper>
        </Container>
    );
};

export default UserProfile;