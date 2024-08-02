const Item = require("../model/ItemModel");
const Recipe = require("../model/RecipeModel");

const getCategory = async (req, res)=>{
    const {category} = req.params;
    try {
        const items = await Recipe.find({category: { $regex: `^${category}$`, $options: 'i'}});
        if(!items){
            return res.status(404).json({message: "Category not found!"});
        }
        return res.status(200).json(items);
    } catch (error) {
        res.status(500).json({message: "No category specified"});
    }
}

module.exports = {
    getCategory
}