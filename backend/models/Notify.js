const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    count: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
