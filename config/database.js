const mongoose = require("mongoose");


const connectToDatabase = () => {
  mongoose.connect("mongodb+srv://testapp:testapp@cluster0.a3qhggk.mongodb.net/agriconnect", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
};

module.exports = connectToDatabase; 
