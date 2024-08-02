const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecipeSchema = new Schema({
  recipeName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  video: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  preparationTime: {
    type: String,
    required: true
  },
  cookTime: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  aboutDish: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  comments: [{
    username: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
