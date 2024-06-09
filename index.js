const express = require("express");
const cors = require("cors");
const http = require('http');
require('dotenv').config();
const connectToDatabase = require("./config/database");
const cloudinary = require('cloudinary').v2;

// Initialize the app
const app = express();

// Middleware for CORS
const corsOptions = {
  origin: ['https://growto.in', 'http://localhost:3000', 'http://localhost:5173', 'https://admin.growto.in'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'diffu1623',
  api_key: '921357913348148',
  api_secret: '_GEunOyK6M7pUkiAFu5fdku2rLg'
});

// Import routes and middlewares
const errorHandler = require("./middlewares/errorHandlers");
const userRoutes = require('./Router/userRoutes');
const providerRoutes = require('./Router/ProviderRoutes');
const superAdminRoutes = require('./Router/SuperAdmin');

// Set up routes
app.use('/api/user', userRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/superadmin', superAdminRoutes);

// Error handling middleware
app.use(errorHandler);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create and start the HTTP server
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Express Server Running on http://localhost:${PORT}/api/user/machines`);
});
