// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddresses,
  editAddress,
  deleteAddress,
} = require("../controller/User/userAddress");
const machineController = require("../controller/machine.controller");
const { addFeedback } = require("../controller/User/feedback");
const UserAuth = require("../controller/User/UserAuth");
const OwnerUserAuth = require("../controller/admin/OwnerAuth");
const userController = require("../controller/User/userProfile");
const {
  PlaceOrder,
  getUserOrders,
  getAdminOrders,
} = require("../controller/User/Order");

router.post("/addAddress", addAddress);
router.get("/getAddresses/:mobileNumber", getAddresses);
router.put("/editAddress", editAddress);
router.delete("/deleteAddress", deleteAddress);
router.get("/machines", machineController.getMachines);
router.get("/getmachines/:id", machineController.getMachineById);
router.get("/profile/update", userController.updateProfile);
router.post("/place-orders", PlaceOrder);
router.get("/user-orders/:userId", getUserOrders);
router.post("/register", UserAuth.Registration);
router.post("/login", UserAuth.loginUser);
router.post("/createprofile", UserAuth.createProfile);
router.post("/feedback", addFeedback);

module.exports = router;
