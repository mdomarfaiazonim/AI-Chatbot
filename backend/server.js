// backend/server.js

const dotenv = require('dotenv');

// LOAD ENV VARIABLES FIRST
dotenv.config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const errorHandler = require('./middleware/errorHandler');



// =========================
// DB CONNECTION
// =========================
connectDB();



// =========================
// APP INIT
// =========================
const app = express();



// =========================
// MIDDLEWARES
// =========================

// JSON parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors());



// =========================
// ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);



// =========================
// HEALTH CHECK
// =========================
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AI Chatbot Backend is running'
    });
});



// =========================
// ERROR HANDLER
// =========================
app.use(errorHandler);



// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});