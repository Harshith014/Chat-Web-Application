// const cloudinary = require('cloudinary').v2;
const cloudinary = require('../cloudinary');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Notification = require('../models/Notify');
const { Wit, log } = require('node-wit');
const { translate } = require('@vitalets/google-translate-api');
const supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru'];

const witClient = new Wit({ accessToken: process.env.WIT_AI_ACCESS_TOKEN });


// Function to generate bot response based on Wit.ai output
const getBotResponse = (witResponse) => {
    const intents = witResponse.intents;
    if (intents.length === 0) {
        return "I'm not sure how to respond to that. Can you please rephrase?";
    }

    const intent = intents[0].name;
    switch (intent) {
        case 'greet':
            return 'Hello! How can I help you today?';
        case 'bye':
            return 'Goodbye! Have a great day!';
        case 'thanks':
            return 'You\'re welcome!';
        default:
            return "I'm not sure how to respond to that. Can you please rephrase?";
    }
};


exports.sendMessage = async (req, res) => {
    try {
        const { sender, receiver, message, targetLanguage } = req.body;

        // Check if the receiver is the chatbot
        if (receiver === 'chatbot') {
            // Save the sender's message to the database
            const userChat = new Chat({
                sender: sender,
                receiver: receiver,
                message: message
            });
            await userChat.save();

            // Process message with Wit.ai
            const witResponse = await witClient.message(message);
            const botResponse = getBotResponse(witResponse);

            // Save the bot's response as a chat message
            const botChat = new Chat({
                sender: 'chatbot',
                receiver: sender,
                message: botResponse
            });
            await botChat.save();

            return res.status(201).json({ success: true, data: [userChat, botChat], translationsAvailable: true });
        }

        // Existing code for user-to-user messages
        const senderUser = await User.findById(sender);
        if (!senderUser) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }
        const senderUsername = senderUser.username;

        if (!supportedLanguages.includes(targetLanguage)) {
            return res.status(400).json({ success: false, error: 'Invalid target language' });
        }

        let translatedMessage = message;
        let translationsAvailable = true; // Assume translations are available by default

        if (targetLanguage !== 'en') {
            try {
                const translationResult = await translate(message, { to: targetLanguage });
                translatedMessage = translationResult.text;
            } catch (translationError) {
                console.error('Translation failed:', translationError);
                // Handle translation errors
                translationsAvailable = false; // Set translationsAvailable to false
                translatedMessage = message; // Fallback to original message
            }
        }

        const chat = new Chat({ sender, receiver, message: translatedMessage });
        await chat.save();

        const notification = new Notification({
            user: receiver,
            sender: sender,
            message: `You got a ${translatedMessage === message ? 'new' : 'translated'} message from ${senderUsername}`,
        });
        await notification.save();

        res.status(201).json({ success: true, data: chat, translationsAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.sendImage = async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        const imageUrl = result.secure_url; // URL of the uploaded image on Cloudinary

        const senderUser = await User.findById(sender);
        if (!senderUser) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }
        const senderUsername = senderUser.username;

        // Save chat with Cloudinary URL
        const chat = new Chat({ sender, receiver, imageUrl });
        await chat.save();

        // Create notification
        const notification = new Notification({
            user: receiver,
            sender: sender,
            message: `You got an image from ${senderUsername}`,
        });
        await notification.save();

        res.status(201).json({ success: true, data: chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Handle sending documents
exports.sendDocs = async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        // Upload document to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        const docUrl = result.secure_url; // URL of the uploaded document on Cloudinary

        const senderUser = await User.findById(sender);
        if (!senderUser) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }
        const senderUsername = senderUser.username;

        // Save chat with Cloudinary URL
        const chat = new Chat({ sender, receiver, docUrl });
        await chat.save();

        // Create notification
        const notification = new Notification({
            user: receiver,
            sender: sender,
            message: `You received a document from ${senderUsername}`,
        });
        await notification.save();

        res.status(201).json({ success: true, data: chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
exports.sendVoiceMessage = async (req, res) => {
    try {
        const { sender, receiver } = req.body;

        // Upload voice message to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video' // Assuming voice messages are treated as video resources in Cloudinary
        });

        const voiceMessageUrl = result.secure_url; // URL of the uploaded voice message on Cloudinary

        const senderUser = await User.findById(sender);
        if (!senderUser) {
            return res.status(404).json({ success: false, error: 'Sender not found' });
        }
        const senderUsername = senderUser.username;

        // Save chat with Cloudinary URL
        const chat = new Chat({ sender, receiver, voiceMessageUrl });
        await chat.save();

        // Create notification
        const notification = new Notification({
            user: receiver,
            sender: sender,
            message: `You got a voice message from ${senderUsername}`,
        });
        await notification.save();

        res.status(201).json({ success: true, data: chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
// Controller to retrieve chat history between two users
exports.getChatHistory = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const chatHistory = await Chat.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: chatHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.saveTheme = async (req, res) => {
    try {
        const { sender, receiver, theme } = req.body;

        // Handle the theme for chatbot
        if (receiver === 'chatbot') {
            // Save the theme for the sender specifically for the chatbot
            let chat = await Chat.findOne({ sender, receiver: 'chatbot' });

            if (!chat) {
                chat = new Chat({ sender, receiver: 'chatbot', theme });
            } else {
                chat.theme = theme;
            }

            await chat.save();
            return res.status(200).json({ success: true });
        }

        // Existing logic for saving theme between users
        let chat = await Chat.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        });

        if (!chat) {
            chat = new Chat({ sender, receiver, theme });
        } else {
            chat.theme = theme;
        }

        await chat.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getTheme = async (req, res) => {
    try {
        const { sender, receiver } = req.query;

        // Handle the theme for chatbot
        if (receiver === 'chatbot') {
            const chat = await Chat.findOne({ sender, receiver: 'chatbot' });

            if (!chat) {
                return res.status(404).json({ success: false, error: 'Chat with chatbot not found' });
            }

            return res.status(200).json({ success: true, theme: chat.theme });
        }

        // Existing logic for retrieving theme between users
        const chat = await Chat.findOne({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        });

        if (!chat) {
            return res.status(404).json({ success: false, error: 'Chat not found' });
        }

        res.status(200).json({ success: true, theme: chat.theme });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


