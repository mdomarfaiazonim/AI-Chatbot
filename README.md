# AI Chatbot Backend (MERN + AI)

A production-style AI chatbot backend built using the MERN stack architecture with secure JWT authentication, refresh token workflow, protected routes, AI conversation memory, and Groq/OpenAI-compatible LLM integration.

This project is designed to simulate a real-world AI SaaS backend architecture rather than a simple CRUD tutorial project.

---

# Features

## Authentication & Security

- User signup and login
- JWT access token authentication
- Refresh token workflow
- HTTP-only secure cookies
- Password hashing with bcrypt
- Protected routes middleware
- Role-based authorization
- Rate limiting
- Input validation using Joi

---

## AI Chat System

- AI-powered chatbot responses
- Conversation history persistence
- User-specific chat memory
- Multi-user support
- Groq/OpenAI-compatible API integration

---

## Backend Architecture

- MVC pattern
- Modular folder structure
- Centralized error handling
- Environment-based configuration
- MongoDB Atlas support
- Clean middleware pipeline

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Authentication

- JWT
- bcryptjs
- cookie-parser

---

## Validation & Security

- Joi
- express-rate-limit
- cors

---

## AI Integration

- Groq API
- OpenAI SDK

---

# Folder Structure

```txt
backend/
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── chatController.js
│
├── middleware/
│   ├── errorHandler.js
│   ├── protect.js
│   ├── authorize.js
│   └── rateLimiter.js
│
├── models/
│   ├── User.js
│   └── Message.js
│
├── routes/
│   ├── authRoutes.js
│   └── chatRoutes.js
│
├── utils/
│   └── token.js
│
├── validators/
│   ├── authValidator.js
│   └── validate.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
