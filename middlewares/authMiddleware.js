const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Auth Failed",
        });
      } else {
        // console.log("Decoded JWT:", decode);
        // console.log("reqs1" , req.userId); 
        req.userId = decode.userId;
        // console.log("reqs2" , req.userId);
        next();
      }
    }); 
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Auth Failedd",
      error,
    });
  }
};