const Item = require("../model/ItemModel")

const getAllItems = async (req, res) => {
    const result = await Item.find().sort({createAt: -1});
    res.status(200).json(result);
}

const getLatestItems = async (req, res) => {
    const result = await Item.find().sort({createAt: -1}).limit(4);
    res.status(200).json(result);
}

const getSearchedItems = async (req, res) => {
    const {q} = req.query;
    try{
        let items;
        if(q){
            items = await Item.find({name: {$regex: q, $options: 'i'}})
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
    getLatestItems
}