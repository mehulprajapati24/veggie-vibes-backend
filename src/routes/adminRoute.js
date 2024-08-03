const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../../utilities");


router.post("/login", adminController.validateAdmin);
router.get("/dashboard", authenticateToken ,adminController.getDashboard);
router.get("/getusers", adminController.getUsers);
router.put("/:userId", adminController.updateProfile);
router.delete("/delete/:userId", adminController.deleteUser);
router.put("/update/:userId", adminController.updatedUser);
router.post("/adduser", adminController.addUser);
router.get("/getrecipes", adminController.getRecipes);
router.put("/update-recipe/:recipeId", adminController.updateRecipe);
router.delete("/delete-recipe/:recipeId", adminController.deleteRecipe);

module.exports = router;