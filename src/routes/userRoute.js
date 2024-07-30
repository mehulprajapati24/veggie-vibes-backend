const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signup", userController.createUserOtp);
router.post("/verify-otp", userController.createUser);
router.post("/login", userController.validateUser);
router.post("/forgot-password", userController.forgotPasswordGenerateOtp);
router.post("/forgot-password/otp", userController.validateOtpLogin);
router.post("/change-password", userController.changePassword);


module.exports = router;