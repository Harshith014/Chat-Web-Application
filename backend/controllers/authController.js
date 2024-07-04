const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getUsersExcludingCurrentUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const users = await User.find({ _id: { $ne: userId } });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = {
            username: user.username,
            email: user.email,
            avatar: user.avatar
        };

        res.status(200).json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { username, email } = req.body;

    const updateFields = { username, email };

    if (req.file) {
        updateFields.avatar = `/uploads/${req.file.filename}`;
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUserProfile = {
            username: user.username,
            email: user.email,
            avatar: user.avatar
        };

        res.status(200).json(updatedUserProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { registerUser, authUser, getUsersExcludingCurrentUser, getProfile, updateProfile };
