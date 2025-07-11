import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js';
import vendorRoute from './routes/venderRoute.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

// Load environment variables first
dotenv.config();

const App = express();
const port = process.env.PORT || 3000;

// Middleware setup
App.use(express.json());
App.use(cookieParser());

// Single CORS configuration with multiple origins
const allowedOrigins = [
  'https://rent-a-ride-two.vercel.app', 
  'http://localhost:5173'
];

App.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// Cloudinary configuration
App.use('*', cloudinaryConfig);

// Database connection
mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin", adminRoute);
App.use("/api/vendor", vendorRoute);

App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false, // Add success field
    message,
    statusCode,
  });
});

// Start server
App.listen(port, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});
