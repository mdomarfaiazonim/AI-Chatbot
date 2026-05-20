// backend/utils/token.js

const jwt = require('jsonwebtoken');



// =========================
// ACCESS TOKEN
// =========================
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: '15m'// process.env.ACCESS_TOKEN_EXPIRE || '15m'
        }
    );
};



// =========================
// REFRESH TOKEN
// =========================
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: '7d'// process.env.REFRESH_TOKEN_EXPIRE || '7d'
        }
    );
};



// =========================
// SET TOKENS IN HTTP-ONLY COOKIES
// =========================
const setTokenCookies = (res, accessToken, refreshToken) => {

    const isProduction = process.env.NODE_ENV === 'production';

    // ACCESS TOKEN COOKIE
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // REFRESH TOKEN COOKIE
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};



// =========================
// EXPORTS
// =========================
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    setTokenCookies
};