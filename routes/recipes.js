const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// Get all recipes
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific recipe by ID
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe == null) {
      return res.status(404).json({ message: 'Cannot find recipe' });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new recipe
router.post('/recipes', async (req, res) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    cookingTime: req.body.cookingTime,
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Recipe already exists' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// Update a recipe
router.put('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe == null) {
      return res.status(404).json({ message: 'Cannot find recipe' });
    }

    if (req.body.title != null) {
      recipe.title = req.body.title;
    }
    if (req.body.ingredients != null) {
      recipe.ingredients = req.body.ingredients;
    }
    if (req.body.instructions != null) {
      recipe.instructions = req.body.instructions;
    }
    if (req.body.cookingTime != null) {
      recipe.cookingTime = req.body.cookingTime;
    }

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a recipe
router.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe == null) {
      return res.status(404).json({ message: 'Cannot find recipe' });
    }

    await recipe.remove();
    res.json({ message: 'Deleted Recipe' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
