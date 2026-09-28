const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dateString: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Agenda', agendaSchema);


// const mongoose = require("mongoose");

// const AgendaSchema = new mongoose.Schema({
//   task: {
//     type: String,
//     required: [true, "Task description is required"],
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
//   date: {
//     type: String, // Stores plain strings like "2026-06-17"
//     required: [true, "A specific target date is required"]
//   }
// }, { 
//   timestamps: true 
// });

// module.exports = mongoose.model('Agenda', AgendaSchema);