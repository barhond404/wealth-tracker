// models/item.js
const mongoose = require('mongoose');

// Define item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['asset', 'liability'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
}, { timestamps: true }); // Include timestamps (createdAt, updatedAt)

module.exports = mongoose.model('Item', itemSchema);
