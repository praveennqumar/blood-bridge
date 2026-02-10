const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
  forgotPasswordController,
  otpController,
  verifyOtp,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes
//REGISTER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//FORGOT PASSWORD || POST
router.post("/forgot-password", forgotPasswordController);

//GET CURRENT USER || GET
router.get("/current-user", authMiddleware, currentUserController);

router.post("/send-mail", otpController);

router.post("/verify-otp", verifyOtp)

module.exports = router;