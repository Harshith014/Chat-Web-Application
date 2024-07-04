const express = require('express');
const { registerUser, authUser, getUsersExcludingCurrentUser, getProfile, updateProfile } = require('../controllers/authController');
const upload = require('../middleware/multerMiddleware.js');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile/:userId', protect, getProfile);
router.put('/profile/:userId', protect, upload.single('avatar'), updateProfile);
// Get all users excluding the current user
router.get('/users/:userId', protect, getUsersExcludingCurrentUser);

module.exports = router;
