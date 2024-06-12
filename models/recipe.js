const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  ingredients: [String],
  instructions: String,
  cookingTime: Number,
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;
