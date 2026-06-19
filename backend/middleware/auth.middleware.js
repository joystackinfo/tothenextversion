const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // grab the token after "Bearer "

            const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify and decode it
            req.user = await User.findById(decoded.id).select('-password'); // attach user to request without password

            next(); // move on to the actual route
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;