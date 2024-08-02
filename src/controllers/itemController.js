const Item = require("../model/ItemModel")
const Recipe = require("../model/RecipeModel")

const getAllItems = async (req, res) => {
    const result = await Recipe.find();
    res.status(200).json(result);
}

const getYourItems = async (req, res) => {
    const user_id = req.user.userId;
    const recipes = await Recipe.find({user: user_id});
    res.status(200).json(recipes);
}

const getLatestItems = async (req, res) => {
    const result = await Recipe.find().limit(4);
    res.status(200).json(result);
}

const getSearchedItems = async (req, res) => {
    const {q} = req.query;
    try{
        let items;
        if(q){
            items = await Recipe.find({recipeName: {$regex: q, $options: 'i'}})
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
            const item = await Item.findById(id);
            res.json(item);
        }catch(error){
            res.status(500).json({message: "No item found!"});
        }
    }

module.exports ={
    getAllItems,
    getSearchedItems,
    getSingleItem,
    getLatestItems,
    getYourItems
}