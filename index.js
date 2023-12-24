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
const UserAuth = require("./controller/UserAuth");
const OwnerUserAuth = require("./controller/OwnerAuth");
const userController = require("./controller/user");

const errorHandler = require("./middlewares/errorHandlers");

const { PlaceOrder, getUserOrders, getAdminOrders } = require("./controller/Order");
const { default: axios } = require("axios");

app.get('/machines', machineController.getMachines);
app.get('/getmachines/:id', machineController.getMachineById);
app.get("/profile/update", userController.updateProfile);
app.post("/api/place-orders", PlaceOrder);
app.get("/api/user-orders/:userId", getUserOrders);

app.post("/api/register", UserAuth.Registration);
app.post("/api/login", UserAuth.loginUser);
app.post("/api/createprofile", UserAuth.createProfile);

// Admin Routes

app.post("/api/admin/register", OwnerUserAuth.ownerRegistration);
app.post("/api/admin/login", OwnerUserAuth.ownerLogin);
app.post("/api/admin/createprofile", OwnerUserAuth.createOwnerProfile);

app.post('/api/machines/add', machineController.addMachine);
app.put('/api/machines/edit/:id', machineController.EditMachine);
app.delete('/api/machines/delete/:id', machineController.DeleteMachine);
app.get("/api/admin-orders/:adminId", getAdminOrders);

app.get("api/profile/update", OwnerUserAuth.updateProfile);




app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}/machines`);
  // axios.post(`http://api.textmebot.com/send.php?recipient=+916374380946&apikey=ezTBGZEDoJxH&text=testing`)
});
