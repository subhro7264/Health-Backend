const mongoose = require('mongoose');

const SleepSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStartDate: { type: Date, required: true }, // To group records by week
  sleepHours: {
    Mon: { type: Number, default: 0 },
    Tue: { type: Number, default: 0 },
    Wed: { type: Number, default: 0 },
    Thu: { type: Number, default: 0 },
    Fri: { type: Number, default: 0 },
    Sat: { type: Number, default: 0 },
    Sun: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Sleep', SleepSchema);