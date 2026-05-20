// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    refresh
} = require('../controllers/authController');

const {
    authLimiter
} = require('../middleware/rateLimiter');

const validate = require('../validators/validate');
const {
    signupSchema,
    loginSchema
} = require('../validators/authValidator');



// =========================
// AUTH ROUTES
// =========================

// SIGNUP
router.post(
    '/signup',
    authLimiter,
    validate(signupSchema),
    signup
);

// LOGIN
router.post(
    '/login',
    authLimiter,
    validate(loginSchema),
    login
);

// LOGOUT
router.post(
    '/logout',
    logout
);

// REFRESH TOKEN
router.post(
    '/refresh',
    refresh
);

module.exports = router;