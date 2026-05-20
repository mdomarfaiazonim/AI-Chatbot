// backend/routes/chatRoutes.js

const express = require('express');
const router = express.Router();

const {
    sendMessage,
    getChatHistory,
    clearChatHistory
} = require('../controllers/chatController');

const protect = require('../middleware/protect');

const {
    apiLimiter
} = require('../middleware/rateLimiter');



// =========================
// CHAT ROUTES (PROTECTED)
// =========================

// SEND MESSAGE TO AI
router.post(
    '/',
    protect,
    apiLimiter,
    sendMessage
);

// GET CHAT HISTORY
router.get(
    '/history',
    protect,
    getChatHistory
);

// CLEAR CHAT HISTORY
router.delete(
    '/history',
    protect,
    clearChatHistory
);

module.exports = router;