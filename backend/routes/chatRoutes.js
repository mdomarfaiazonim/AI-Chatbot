const express = require('express');
const router  = express.Router();
const {
  sendMessage,
  getHistory,
  clearHistory
} = require('../controllers/chatController');

// POST /api/chat     → send a message
router.post('/', sendMessage);

// GET /api/chat/history    → load history
router.get('/history', getHistory);

// DELETE /api/chat/history → clear history
router.delete('/history', clearHistory);

module.exports = router;