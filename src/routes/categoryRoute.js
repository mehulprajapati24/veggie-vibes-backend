const express = require("express");
const CategoryController = require("../controllers/categoryController");
const router = express.Router();

router.get("/categories/:category", CategoryController.getCategory)

module.exports = router;