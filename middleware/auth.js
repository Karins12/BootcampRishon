const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
    // Skip authentication if in test mode
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH === 'true') return next();

    const token = req.cookies.authToken;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password');

        if (!user) return res.status(404).send('User not found.');

        req.user = user;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = auth;