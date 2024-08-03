const Item = require("../model/ItemModel")
const Recipe = require("../model/RecipeModel")
require('dotenv').config();

const getAllItems = async (req, res) => {
    const result = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(result);
}

const getYourItems = async (req, res) => {
    const user_id = req.user.userId;
    const recipes = await Recipe.find({user: user_id}).sort({ createdAt: -1 });
    res.status(200).json(recipes);
}

const getLatestItems = async (req, res) => {
    const result = await Recipe.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json(result);
}

const getSearchedItems = async (req, res) => {
    const {q} = req.query;
    try{
        let items;
        if(q){
            items = await Recipe.find({recipeName: {$regex: q, $options: 'i'}}).sort({ createdAt: -1 });
        }
        res.status(200).json(items);
    }catch(error){
        res.status(500).json({message: "No items found!"});
    }
}

const getSingleItem = async (req, res) => 
    {
        const {id} = req.params;
        try {
            const item = await Recipe.findById(id);
            res.json(item);
        }catch(error){
            res.status(500).json({message: "No item found!"});
        }
    }

const addComment = async (req, res) => {
    const username = req.user.username;
    const {comment, itemId} = req.body;

    const recipe = await Recipe.findById(itemId);

    const newComment = {
        username: username,
        comment: comment
    };

    recipe.comments.push(newComment);
    await recipe.save();
    res.json({ success: true, comment: newComment });
}

const deleteItem = async (req, res) => {
    const {id} = req.params;
    const user = req.user;

    const recipe = await Recipe.findById(id);

    if (recipe.user.toString() !== user.userId) {
        return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(id);
    res.status(200).json({ message: 'Recipe deleted successfully' });
}

const updateItem = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const updatedData = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(id, updatedData, { new: true });

    if (recipe.user.toString() !== user.userId) {
        return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
    }

    res.status(200).json({ message: "Recipe updated successfully", recipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

}

module.exports ={
    getAllItems,
    getSearchedItems,
    getSingleItem,
    getLatestItems,
    getYourItems,
    addComment,
    deleteItem,
    updateItem
}