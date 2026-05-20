// backend/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');



// =========================
// AUTH LIMITER
// =========================
const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 10,

    message: {
        success: false,
        message: 'Too many auth requests. Try again later.'
    },

    standardHeaders: true,

    legacyHeaders: false
});



// =========================
// CHAT API LIMITER
// =========================
const apiLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 100,

    message: {
        success: false,
        message: 'Too many requests. Please slow down.'
    },

    standardHeaders: true,

    legacyHeaders: false
});



module.exports = {
    authLimiter,
    apiLimiter
};