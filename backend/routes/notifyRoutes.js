const express = require('express');
const { getNotifications, markAsRead } = require('../controllers/notifyController');
const router = express.Router();

router.get('/:userId', getNotifications);
router.put('/:notifiyId/read', markAsRead);

module.exports = router;
