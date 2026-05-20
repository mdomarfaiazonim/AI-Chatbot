// backend/validators/authValidator.js

const Joi = require('joi');



// =========================
// SIGNUP VALIDATION
// =========================
const signupSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name must be at most 50 characters',
            'any.required': 'Name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});



// =========================
// LOGIN VALIDATION
// =========================
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});



module.exports = {
    signupSchema,
    loginSchema
};