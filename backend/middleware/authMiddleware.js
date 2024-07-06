const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;


    if (req.headers.authorization) {
        try {
            token = req.headers.authorization;

            // Decode and verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID and attach to the request object
            req.user = await User.findById(decoded.id).select('-password');

            // Move to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Error in auth middleware:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
