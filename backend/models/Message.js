// backend/models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },

        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Message', messageSchema);