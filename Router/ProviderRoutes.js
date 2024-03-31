// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const OwnerUserAuth = require("../controller/admin/OwnerAuth");
const machineController = require("../controller/machine.controller");

const { getAdminOrders, AcceptOrder, RejectOrder, ViewOrder } = require("../controller/admin/AdminOrders");
const Multer = require("multer");
const upload = Multer({ storage: Multer.memoryStorage() });

router.post("/register", OwnerUserAuth.OwnerRegistration);
router.post("/sendotp", OwnerUserAuth.sendOTP);
router.post("/login", OwnerUserAuth.Ownerlogin);
router.post("/createprofile", OwnerUserAuth.createOwnerProfile);
router.get("/profile/update", OwnerUserAuth.updateProfile);


router.get(
  "/machines/Provider/:adminID",
  machineController.getMachinesByAdminID
  );
router.post(
  "/machines/add",
  upload.single("my_file"),
  machineController.addMachine
  );
  
  router.get("/machines", machineController.getMachines);
  router.put("/machines/edit/:id", machineController.EditMachine);
  router.delete("/machines/delete/:id", machineController.DeleteMachine);
  router.get("/getmachines/:id", machineController.getMachineById);

  router.post("/machines/approve/:machineId", machineController.approveMachine);
  router.post("/machines/reject/:machineId", machineController.rejectMachine);
  
  router.get("/getorders/:adminId", getAdminOrders);
router.post("/orders/accept/:orderId", AcceptOrder);
router.post("/orders/reject/:orderId", RejectOrder);
router.get("/orders/:orderId", ViewOrder);
module.exports = router;
