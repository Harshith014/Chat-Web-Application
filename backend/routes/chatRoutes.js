// routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, sendVoiceMessage, sendImage, sendDocs, getTheme, saveTheme } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware.js');


// Route to send a message
router.post('/send', protect, sendMessage);
router.post('/theme', saveTheme);
router.get('/theme',  getTheme);

// Route to get chat history between two users
router.get('/:senderId/:receiverId', protect, getChatHistory);

router.post('/voice-message', protect, upload.single('voiceMessage'), sendVoiceMessage);

router.post('/image', protect, upload.single('image'), sendImage);

router.post('/docs', protect, upload.single('file'), sendDocs);

module.exports = router;

