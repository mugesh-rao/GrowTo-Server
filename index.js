// server.js
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/database");
const PORT = process.env.PORT || 1000;

const app = express();
app.use(cors());
app.use(express.json());
connectToDatabase();  
const { getUsers , registerUser,getUserById} = require("./controller/user");
const machineController = require("./controller/machine.controller");
const Auth = require('./controller/Auth'); 

app.get("/machines", machineController.getMachines);
app.post("/machines/add", machineController.addMachine);
app.get("/machines/:id", machineController.getMachineById);

app.get("/users", getUsers); 
app.post("/users/register", registerUser); 
app.get("/users/:Id", getUserById);

app.post('/api/register', Auth.Registration);
app.post('/api/verify', Auth.Verification);
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});