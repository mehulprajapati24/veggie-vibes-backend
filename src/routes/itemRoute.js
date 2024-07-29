const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");

router.get("/all-items", itemController.getAllItems);

router.get("/items", itemController.getSearchedItems);

router.get("/items/:id", itemController.getSingleItem);

router.get("/latest-items", itemController.getLatestItems);


module.exports = router;