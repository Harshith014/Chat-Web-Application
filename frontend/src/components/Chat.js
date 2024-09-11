import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import PaletteIcon from '@mui/icons-material/Palette';
import SendIcon from '@mui/icons-material/Send';
import { Box, IconButton, MenuItem, Popover, Select, TextField, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { ColorModeContext } from '../context/ThemeContext';
import '../css/Chat.css';
import { getUserIdFromToken } from '../utils/Auth';
import Allusers from './Allusers';
import Notify from './Notify';
import VoiceMessage from './VoiceMsg';

const themeOptions = [
    { name: 'Default', backgroundColor: '#ffffff', textColor: '#000000' },
    { name: 'Dark Mode', backgroundColor: '#333333', textColor: '#ffffff' },
    { name: 'Ocean Blue', backgroundColor: '#0077cc', textColor: '#ffffff' },
    { name: 'Forest Green', backgroundColor: '#388e3c', textColor: '#ffffff' },
    { name: 'Sunset Orange', backgroundColor: '#ff5722', textColor: '#ffffff' },
];

const Chat = () => {
    const chatHistoryRef = useRef(null);

    const [receiver, setReceiver] = useState('');
    const [translationsAvailable, setTranslationsAvailable] = useState(true);
    const [receiverName, setReceiverName] = useState('');
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState({});
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [docFile, setDocFile] = useState(null);
    const [showAttachmentIcons, setShowAttachmentIcons] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const [selectedThemes, setSelectedThemes] = useState({}); // State to manage themes per user
    const [isChatMaximized, setIsChatMaximized] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991);
    const theme = useTheme();
    const { mode } = useContext(ColorModeContext);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 991);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggleUsers = () => {
        setIsChatMaximized(false);
        if (isSmallScreen) {
            setReceiver('');
            setReceiverName('');
        }
    };

    useEffect(() => {
        if (receiver) {
            fetchThemeFromDB();
        }
    }, [receiver]);

    const fetchThemeFromDB = async () => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            const response = await axios.get(`${process.env.REACT_APP_URI}/api/chat/theme?sender=${userId}&receiver=${receiver}`);
            const themeFromDB = response.data.theme;

            setSelectedThemes((prevThemes) => ({ ...prevThemes, [receiver]: themeFromDB }));
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('...');
                setSelectedThemes((prevThemes) => ({ ...prevThemes, [receiver]: 'defaultTheme' }));
            } else {
                console.error(error);
            }
        }
    };

    const handleThemeSelect = (theme) => {
        setSelectedThemes((prevThemes) => ({ ...prevThemes, [receiver]: theme }));
        setShowThemeSelector(false);
        saveThemeToDB(theme);
        setMessage('');
    };

    const saveThemeToDB = async (theme) => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            await axios.post(`${process.env.REACT_APP_URI}/api/chat/theme`, { sender: userId, receiver: receiver, theme });
        } catch (error) {
            console.error(error);
        }
    };

    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

    const handleOpenPopover = (event) => {
        setPopoverAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setPopoverAnchorEl(null);
    };

    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Authorization': token,
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
    };


    const fetchChatHistory = async (receiverId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                return;
            }
            const senderId = userId;

            const res = await axios.get(`${process.env.REACT_APP_URI}/api/chat/${senderId}/${receiverId}`, config);

            if (res.data.data.length === 0) {
                console.log('...');
                setChatHistory(prevChatHistory => ({
                    ...prevChatHistory,
                    [receiverId]: [], // or some default value
                }));
            } else {
                setChatHistory(prevChatHistory => ({
                    ...prevChatHistory,
                    [receiverId]: res.data.data,
                }));
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching chat history');
        }
    };

    useEffect(() => {
        if (receiver) {
            fetchChatHistory(receiver);
        }
    }, [receiver]);

    const handleSendMessage = async () => {
        if (!message) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            const sender = userId;

            const data = { sender, receiver, message, targetLanguage };

            const res = await axios.post(`${process.env.REACT_APP_URI}/api/chat/send`, data, config);
            // Check if translations are available
            const translationsAvailable = res.data.translationsAvailable;

            // Handle translations availability based on server response
            setTranslationsAvailable(translationsAvailable);

            // Update the chat history only if translations are available
            if (translationsAvailable) {
                setResponse(res.data);
                setError(null);
                setMessage('');
                fetchChatHistory(receiver);
            } else {
                setError(null); // Clear any previous error
                setTargetLanguage('en'); // Reset to default language
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
            setResponse(null);
        }
    };

    const handleUserClick = (userId, userName) => {
        setReceiver(userId);
        setReceiverName(userName);
        setIsChatMaximized(true);
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            setError('No image selected');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            const sender = userId;
            const formData = new FormData();
            formData.append('sender', sender);
            formData.append('receiver', receiver);
            formData.append('image', imageFile);

            const res = await axios.post(`${process.env.REACT_APP_URI}/api/chat/image`, formData, {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResponse(res.data);
            setError(null);
            setImageFile(null);
            setShowAttachmentIcons(false);
            fetchChatHistory(receiver);
        } catch (err) {
            setError(err.message || 'An error occurred');
            setResponse(null);
        }
    };

    const handleDocUpload = async () => {
        if (!docFile) {
            setError('No document selected');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                setError('User ID not found');
                return;
            }

            const sender = userId;
            const formData = new FormData();
            formData.append('sender', sender);
            formData.append('receiver', receiver);
            formData.append('file', docFile);

            const res = await axios.post(`${process.env.REACT_APP_URI}/api/chat/docs`, formData, {
                headers: {
                    ...config.headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResponse(res.data);
            setError(null);
            setDocFile(null);
            setShowAttachmentIcons(false);
            fetchChatHistory(receiver);
        } catch (err) {
            setError(err.message || 'An error occurred');
            setResponse(null);
        }
    };

    const chatHistoryAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { mass: 1, tension: 280, friction: 30 },
    });

    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString();
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return 'Invalid Date';
        }
    };

    const formatDate = (timestamp) => {
        try {
            const date = new Date(timestamp);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    return (
        <div className="chat-container flex flex-col h-screen" style={{ outline: `2px solid ${theme.palette.divider}` }}>

            <Box className="flex flex-grow">
                {(!isChatMaximized || !isSmallScreen) && (
                    <Box className={`chat-sidebar ${isSmallScreen ? 'w-full' : 'w-1/4'} p-4`} style={{ backgroundColor: mode === 'dark' ? '#333' : '#f8f9fa', outline: `1px solid ${theme.palette.divider}` }}>
                        <Allusers handleUserClick={handleUserClick} selectedUser={receiver} />
                    </Box>
                )}
                {(isChatMaximized || !isSmallScreen) && (
                    <Box className={`chat-main flex flex-col ${isChatMaximized ? 'w-full' : 'w-3/4'}`} style={{ outline: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column' }}>
                        {receiver ? (
                            <>
                                <Box className="flex-none p-4 flex items-center justify-between" style={{ backgroundColor: mode === 'dark' ? '#333' : '#f8f9fa', outline: `1px solid ${theme.palette.divider}` }}>
                                    <IconButton onClick={handleToggleUsers}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        sx={{
                                            borderBottom: `2px solid ${theme.palette.divider}`,
                                            paddingBottom: theme.spacing(1),
                                            marginBottom: theme.spacing(2),
                                            display: 'inline-block',
                                            width: '100%',
                                            color: mode === 'dark' ? '#fff' : '#000',
                                        }}
                                    >
                                        Chat with {receiverName}
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={handleOpenPopover}>
                                            <PaletteIcon />
                                        </IconButton>
                                        <Popover
                                            open={Boolean(popoverAnchorEl)}
                                            anchorEl={popoverAnchorEl}
                                            onClose={handleClosePopover}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <Box sx={{ p: 2, minWidth: '200px', maxHeight: '300px', overflowY: 'auto' }}>
                                                {themeOptions.map((option, index) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            backgroundColor: option.backgroundColor,
                                                            color: option.textColor,
                                                            padding: '8px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            marginBottom: '4px',
                                                        }}
                                                        onClick={() => handleThemeSelect(option)}
                                                    >
                                                        {option.name}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Popover>
                                    </Box>
                                </Box>

                                <animated.div
                                    ref={chatHistoryRef}
                                    className="chat-history flex-grow overflow-y-auto overflow-x-hidden mb-4 flex flex-col relative p-4"
                                    style={{
                                        ...chatHistoryAnimation,
                                        backgroundColor: selectedThemes[receiver] ? selectedThemes[receiver].backgroundColor : theme.palette.background.default,
                                        flexGrow: 1,
                                        flexShrink: 1,
                                        flexBasis: 'auto',
                                    }}
                                >
                                    {chatHistory[receiver]?.map((chat, index) => {
                                        if (!chat.message && !chat.voiceMessageUrl && !chat.imageUrl && !chat.docUrl) return null;

                                        return (
                                            <div key={chat._id} className={`chat-message-wrapper ${chat.sender === getUserIdFromToken() ? 'self-end' : 'self-start'}`}>
                                                {index === 0 || new Date(chat.createdAt).toDateString() !== new Date(chatHistory[receiver][index - 1].createdAt).toDateString() ? (
                                                    <div className="chat-date-divider text-center my-2">
                                                        <hr className="date-divider-line border-t my-1" style={{ borderColor: theme.palette.divider }} />
                                                        <span className="date-divider-text px-2 rounded-full" style={{ backgroundColor: mode === 'dark' ? '#333' : '#f8f9fa' }}>
                                                            {formatDate(chat.createdAt)}
                                                        </span>
                                                        <hr className="date-divider-line border-t my-1" style={{ borderColor: theme.palette.divider }} />
                                                    </div>
                                                ) : null}
                                                <div
                                                    className={`chat-message ${chat.sender === getUserIdFromToken() ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-lg p-2 max-w-xs break-words`}
                                                    style={{
                                                        backgroundColor: chat.sender === getUserIdFromToken() ? theme.palette.primary.main : (mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default),
                                                        color: chat.sender === getUserIdFromToken() ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                                        wordWrap: 'break-word',
                                                        overflowWrap: 'break-word',
                                                        whiteSpace: 'pre-wrap',
                                                    }}
                                                >
                                                    {(chat.message && chat.message.trim() !== '') || chat.voiceMessageUrl || chat.imageUrl || chat.docUrl ? (
                                                        <>
                                                            {chat.message && chat.message.trim() !== '' ? (
                                                                <span style={{ wordBreak: 'break-word' }}>{chat.message}</span>
                                                            ) : chat.voiceMessageUrl ? (
                                                                <audio controls>
                                                                    <source src={chat.voiceMessageUrl} type="audio/webm" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            ) : chat.imageUrl ? (
                                                                <img src={chat.imageUrl} alt="pic" className="max-w-full h-auto" />
                                                            ) : chat.docUrl ? (
                                                                <div>
                                                                    <DescriptionIcon style={{ verticalAlign: 'iddle', marginRight: '4px' }} />
                                                                    <a href={chat.docUrl} target="_blank" rel="noopener noreferrer" style={{ color: mode === 'dark' ? '#fff' : theme.palette.primary.main }}>
                                                                        {chat.docUrl.substring(chat.docUrl.lastIndexOf('/') + 1)}
                                                                    </a>
                                                                </div>
                                                            ) : null}
                                                        </>
                                                    ) : (
                                                        <span style={{ color: 'gray', fontSize: '12px' }}>Empty message</span>
                                                    )}
                                                </div>
                                                <div className="chat-timestamp text-xs mt-1" style={{ color: theme.palette.text.secondary }}>
                                                    {formatTimestamp(chat.createdAt)}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </animated.div>
                                <Box className="chat-input flex items-center p-4" style={{
                                    backgroundColor: mode === 'dark' ? '#333' : '#f8f9fa', outline: `1px solid ${theme.palette.divider}`,
                                    flexShrink: 0,
                                    position: 'sticky',
                                    bottom: 0,
                                }}>
                                    <TextField
                                        className="flex-grow mr-2"
                                        placeholder="Type your message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        variant="outlined"
                                        InputProps={{
                                            style: {
                                                backgroundColor: mode === 'dark' ? '#424242' : '#fff',
                                                color: mode === 'dark' ? '#fff' : '#000',
                                                fontSize: "0.875rem",
                                            },
                                            endAdornment: (
                                                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                                    <EmojiEmotionsIcon />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                    {showEmojiPicker && (
                                        <Box position="absolute" zIndex="tooltip" bottom="70px" right="20px">
                                            <EmojiPicker
                                                key={mode}
                                                onEmojiClick={handleEmojiClick}
                                                theme={mode === 'dark' ? 'dark' : 'light'}
                                                emojiStyle="native"
                                                width={300}
                                                height={400}
                                            />
                                        </Box>
                                    )}
                                    {!translationsAvailable ? (
                                        <Typography variant="body2" color="textSecondary">
                                            Translations not available
                                        </Typography>
                                    ) : (
                                        <Select
                                            value={targetLanguage}
                                            onChange={(e) => setTargetLanguage(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            style={{ marginRight: '8px', backgroundColor: mode === 'dark' ? '#424242' : '#fff' }}
                                        >
                                            <MenuItem value="en">English</MenuItem>
                                            <MenuItem value="fr">French</MenuItem>
                                            <MenuItem value="es">Spanish</MenuItem>
                                            <MenuItem value="de">German</MenuItem>
                                            <MenuItem value="it">Italian</MenuItem>
                                            <MenuItem value="pt">Portuguese</MenuItem>
                                            <MenuItem value="ru">Russian</MenuItem>
                                        </Select>
                                    )}
                                    <IconButton onClick={() => setShowAttachmentIcons(!showAttachmentIcons)}>
                                        <AttachFileIcon />
                                    </IconButton>
                                    {showAttachmentIcons && (
                                        <>
                                            <IconButton component="label">
                                                <ImageIcon />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(e) => setImageFile(e.target.files[0])}
                                                />
                                            </IconButton>
                                            <IconButton component="label">
                                                <DescriptionIcon />
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    hidden
                                                    onChange={(e) => setDocFile(e.target.files[0])}
                                                />
                                            </IconButton>
                                        </>
                                    )}
                                    <IconButton
                                        color="primary"
                                        onClick={imageFile ? handleImageUpload : docFile ? handleDocUpload : handleSendMessage}
                                        disabled={!(imageFile || docFile || message)}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                    <Box className="voice-message-recorder">
                                        <VoiceMessage sender={getUserIdFromToken()} receiver={receiver} onMessageSent={() => fetchChatHistory(receiver)} />
                                    </Box>
                                </Box>
                                <Notify userId={getUserIdFromToken()} />
                            </>
                        ) : (
                            <Box className="flex items-center justify-center h-full">
                                <Typography variant="h6">Select a user to start chatting</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default Chat;