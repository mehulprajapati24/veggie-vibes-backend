const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { authenticateToken } = require("../../utilities");


router.get("/all-items", itemController.getAllItems);

router.get("/items", itemController.getSearchedItems);

router.get("/items/:id", itemController.getSingleItem);

router.get("/latest-items", itemController.getLatestItems);

router.get("/your-items", authenticateToken, itemController.getYourItems);

router.post("/comment", authenticateToken, itemController.addComment);

router.delete("/your-items/:id", authenticateToken ,itemController.deleteItem);

router.put("/update-recipe/:id", authenticateToken, itemController.updateItem);

module.exports = router;