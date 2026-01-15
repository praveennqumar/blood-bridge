const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//create inventory (blood record)
console.log("Inside inventory controller");
const createInventoryController = async (req, res) => {
    try {
        const { email, inventoryType} = req.body;
        //validation
        // console.log("Creating inventory for email:", email, "with type:", inventoryType);
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User Not Found");
        }
        
        if (inventoryType === "in" && user.role !== "donar") {
            throw new Error("Not a donar account");
        }
        if (inventoryType === "out" && user.role !== "hospital") {
            throw new Error("Not a hospital");
        }

        //save inventory
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "Inventory Created Successfully",
            inventory,
        });

    } catch (error) {
        console.log("Error creating inventory:", error.message);
        return res.status(500).send({
            success: false,
            message: "CATCH FROM INVENTORY CONTROLLER",
        });
    }
};

// get all inventory (blood records)
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};

module.exports = {
    createInventoryController,
    getInventoryController
};