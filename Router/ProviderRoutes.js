// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const OwnerUserAuth = require("../controller/admin/OwnerAuth");
const machineController = require("../controller/machine.controller");
const {
    getAdminOrders,
  } = require("../controller/User/Order");

router.post("/register", OwnerUserAuth.ownerRegistration);
router.post("/login", OwnerUserAuth.ownerLogin);
router.post("/createprofile", OwnerUserAuth.createOwnerProfile);
router.get("/profile/update", OwnerUserAuth.updateProfile);

router.get("/getorders/:adminId", getAdminOrders);


router.get('/machines/Provider/:adminID', machineController.getMachinesByAdminID);
router.post("/machines/add", machineController.addMachine);
router.put("/machines/edit/:id", machineController.EditMachine);
router.delete("/machines/delete/:id", machineController.DeleteMachine);


module.exports = router;
