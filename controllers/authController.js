const userModel = require("../models/userModel");
const otpModel = require("../models/EmailOpt");
const generateOTP = require("../utils/otp.util");
const sendEmail = require("../utils/sendemail.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    //validation
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "User ALready exists",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    //rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
      success: true,
      message: "User Registerd Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

//login call back
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // console.log("User Role:", user.role, "Request Role:", req.body.role);
    //check role
    if (user.role !== req.body.role) {
      return res.status(500).send({
        success: false,
        message: "role dosent match",
      });
    }
    //compare password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // console.log(`User Logged In Successfully ${process.env.JWT_SECRET}`);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
      user,
      hashedPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Forgot Password API",
      error,
    });
  }
};

//GET CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.userId });
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error,
    });
  }
};

const otpController = async (req, res) => {
  const createOtp = generateOTP();
  const otp = new otpModel({
    email: req.body.email,
    otp: createOtp,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
  });
  await otp.save();
  try {
    console.log("kjhh")
    await sendEmail({
      to: req.body.email,
      subject: "Otp received",
      html:  `<h1>Email sent successfullys ${createOtp} 🚀</h1>`,
    });
    res.json({ success: true, message: "Email sent successfully", otp : createOtp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
};

const verifyOtp = async (req,res) => {
  try{
    const { email, otp } = req.body;
    const otpRecord = await otpModel.findOne({ email }).sort({ otpExpiry: -1 });
    if (otpRecord.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }
    if(otp != otpRecord.otp){
      return res.status(400).json({
        message : "otp not matchedss "
      });
    }
    otpRecord.isVerified = true;
    await otpRecord.save();
    res.json({
      message: "OTP verified successfully",
    });
  } catch(error){
    res.status(500).json({
      message: error.message,
    });
  }
}



module.exports = { registerController, loginController, currentUserController, forgotPasswordController, otpController, verifyOtp };