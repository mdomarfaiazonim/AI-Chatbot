// backend/middleware/protect.js

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const protect = async (req, res, next) => {
    try {

        let token;

        // =========================
        // GET TOKEN FROM COOKIE
        // =========================
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        // =========================
        // OPTIONAL:
        // SUPPORT BEARER TOKEN
        // =========================
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // =========================
        // NO TOKEN
        // =========================
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // =========================
        // VERIFY TOKEN
        // =========================
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        console.log('Decoded JWT:', decoded);

        // =========================
        // FIND USER
        // =========================
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // =========================
        // ATTACH USER TO REQUEST
        // =========================
        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = protect;