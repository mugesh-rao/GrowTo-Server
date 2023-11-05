// routes/machine.routes.js

const express = require("express");
const router = express.Router();
const { getMachineDetails } = require("../controller/machine.controller");

router.get("/:id", getMachineDetails);
router.get("/details/:id", getMachineDetails);

module.exports = router;
