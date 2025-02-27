const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authenticateToken } = require("../../utilities");

router.post("/signup", userController.createUserOtp);
router.post("/verify-otp", userController.createUser);
router.post("/login", userController.validateUser);
router.post("/forgot-password", userController.forgotPasswordGenerateOtp);
router.post("/forgot-password/otp", userController.validateOtpLogin);
router.post("/change-password", userController.changePassword);
router.get("/dashboard", authenticateToken, userController.getDashboard);
router.post("/create-recipe", authenticateToken, userController.createRecipe);
router.get("/getkey", userController.getKey);
router.post("/islocked", userController.isLocked);

module.exports = router;