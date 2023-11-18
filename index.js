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
const authController = require("./controller/UserAuth");
const userController = require("./controller/user");
const OwnerController = require("./controller/Owner");
const errorHandler = require("./middlewares/errorHandlers");
const { default: axios } = require("axios");
const { PlaceOrder } = require("./controller/Order");

app.get('/machines', machineController.getMachines);
app.get('/machines/:id', machineController.getMachineById);
app.get("/profile/update", userController.updateProfile);
app.post("/api/place-orders", PlaceOrder);

app.post("/api/register", authController.Registration);
app.post("/api/createprofile", authController.createProfile);
app.post("/api/login", authController.loginUser);

// Admin Routes


app.post('/api/machines/add', machineController.addMachine);
app.put('/api/machines/edit/:id', machineController.EditMachine);
app.delete('/api/machines/delete/:id', machineController.DeleteMachine);

app.get("api/profile/update", OwnerController.updateProfile);




app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}/machines`);
  // axios.post(`http://api.textmebot.com/send.php?recipient=+916374380946&apikey=ezTBGZEDoJxH&text=testing`)
});
