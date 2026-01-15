const testController = (req, res) => {
  res.status(200).send({
    message: "Welcome users to the Blood Bank Management System API",
    success: true,
  });
};

module.exports = { testController };