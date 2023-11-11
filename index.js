// server.js
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/database");
const PORT = process.env.PORT || 1000;

const app = express();
app.use(cors());
app.use(express.json());
connectToDatabase();

const machineController = require("./controller/machine.controller");
const authController = require("./controller/Auth");
const userController = require("./controller/user");
const OwnerController = require("./controller/Owner");
const errorHandler = require("./middlewares/errorHandlers");

app.get('/machines', machineController.getMachines);
app.get('/machines/:id', machineController.getMachineById);
app.get("/profile/update", userController.updateProfile);

// Admin Routes


app.post('/api/machines/add', machineController.addMachine);
app.put('/api/machines/edit/:id', machineController.EditMachine);
app.delete('/api/machines/delete/:id', machineController.DeleteMachine);

app.get("api/profile/update", OwnerController.updateProfile);

app.post("/api/register", authController.registerUser);
app.post("/api/verify", authController.verifyUser);
app.post("/api/login", authController.loginUser);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
