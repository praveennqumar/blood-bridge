const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
  forgotPasswordController,
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

module.exports = router;