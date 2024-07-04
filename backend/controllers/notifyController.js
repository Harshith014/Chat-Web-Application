const Notification = require('../models/Notify');

exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notifiyId } = req.params;
        const notification = await Notification.findByIdAndUpdate(notifiyId, { isRead: true }, { new: true });
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
