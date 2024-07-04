const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.Mixed, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.Mixed, ref: 'User', required: true },
    message: { type: String },
    voiceMessageUrl: { type: String },
    imageUrl: { type: String },
    docUrl: { type: String },
    theme: {
        type: {
            name: String,
            backgroundColor: String,
            textColor: String
        }
    },
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
