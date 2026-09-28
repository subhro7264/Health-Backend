const mongoose = require("mongoose");

const HydrationSchema = new mongoose.Schema({
  // 1. CRITICAL FIX: Link this hydration log to a specific user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References your User model if you have one
    required: true,
    unique: true, // Prevents multiple hydration docs for the same user
  },
  current: {
    type: Number,
    default: 0,
  },
  customTarget: {
    type: Number,
    default: 2.5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Hydration", HydrationSchema);
