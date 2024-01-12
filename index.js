// server.js
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/database");
const PORT = process.env.PORT || 1000;

const app = express();
app.use(cors());
app.use(express.json());
connectToDatabase();

const errorHandler = require("./middlewares/errorHandlers");

const userRoutes = require('./Router/userRoutes');
const adminRoutes = require('./Router/adminRoutes');



app.use('/api/user', userRoutes);
app.use('/api/admin',adminRoutes );

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}/api/user/machines`);
  // axios.post(`http://api.textmebot.com/send.php?recipient=+916374380946&apikey=Hwd2BzkcxSY4&text=testing`)
});
