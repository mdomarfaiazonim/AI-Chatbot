// backend/controllers/authController.js

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const {
    generateAccessToken,
    generateRefreshToken,
    setTokenCookies
} = require('../utils/token');



// =========================
// SIGNUP
// =========================
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;


        // console.log('Signup request:', { name, email });

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });
        // console.log("Here is the error");
        // console.error(error);

        // Generate tokens
        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token in DB
        user.refreshToken = refreshToken;

        await user.save();
        

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({
            success: true,
            message: 'Signup successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};



// =========================
// LOGIN
// =========================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        // Find user
        const user = await User.findOne({ email }).select('+password');

        // console.log("User found:", user);



        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password); // error ekhane dicchilo karon select('+password') dite bhule gesilam, tai password field aschilo na, tai comparePassword method e this.password undefined chilo, tai bcrypt.compare function error dicchilo. select('+password') diye password field ta include kore niye ashte hobe.
        // console.log("Request body:", req.body);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;

        await user.save();

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};



// =========================
// LOGOUT
// =========================
exports.logout = async (req, res, next) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {

            const user = await User.findOne({ refreshToken });

            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        // Clear cookies
        res.clearCookie('accessToken');

        res.clearCookie('refreshToken');

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        next(error);
    }
};



// =========================
// REFRESH ACCESS TOKEN
// =========================
exports.refresh = async (req, res, next) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token missing'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user._id);

        // Reset cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Access token refreshed'
        });

    } catch (error) {
        next(error);
    }
};