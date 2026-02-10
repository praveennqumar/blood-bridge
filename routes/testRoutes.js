const express = require("express");
const { testController } = require("../controllers/testController");
const sendEmail = require("../utils/sendemail.util")
//router object
const router = express.Router();

//routes
router.get("/", testController);

router.get("/send-test-mail", async (req, res) => {
    try {
        console.log("kjhh")
      await sendEmail({
        to: "systemhard10@gmail.com",
        subject: "SMTP Test",
        html: "<h1>Email sent successfully 🚀</h1>",
      });
  
      res.json({ success: true, message: "Email sent" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Email failed" });
    }
  });

//export
module.exports = router;