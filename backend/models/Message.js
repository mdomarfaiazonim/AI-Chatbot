const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: {
      type:     String,
      enum:     ['user', 'bot'],   // only these 2 values allowed
      required: true
    },
    content: {
      type:     String,
      required: true,
      trim:     true               // strips leading/trailing whitespace
    }
  },
  {
    timestamps: true               // auto-adds createdAt, updatedAt
  }
);

module.exports = mongoose.model('Message', messageSchema);