const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalCalories: {
      type: Number,
      required: true,
    },
    macros: {
      protein: String,
      carbs: String,
      fats: String,
    },
    meals: [
      {
        meal: String,
        title: String,
        calories: Number,
        description: String,
      },
    ],
    nutritionTip: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Diet', dietSchema);