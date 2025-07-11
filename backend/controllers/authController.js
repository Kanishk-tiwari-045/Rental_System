import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";

const expireDate = new Date(Date.now() + 3600000);

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Add input validation
  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (password.length < 4) {
    return next(errorHandler(400, "Password must be at least 4 characters"));
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isUser: true,
    });
    
    await newUser.save();
    
    // Return consistent response format
    res.status(201).json({ 
      success: true,
      message: "User created successfully",
      statusCode: 201
    });
    
  } catch (error) {
    console.error('SignUp error:', error);
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Add input validation
  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    // Use consistent environment variable names
    const accessToken = Jwt.sign(
      { id: validUser._id }, 
      process.env.ACCESS_TOKEN, // Changed from ACCESS_TOKEN
      { expiresIn: "15m" }
    );
    
    const refreshToken = Jwt.sign(
      { id: validUser._id }, 
      process.env.REFRESH_TOKEN, // Changed from REFRESH_TOKEN
      { expiresIn: "7d" }
    );

    // Update user with refresh token
    await User.findByIdAndUpdate(
      validUser._id,
      { refreshToken },
      { new: true }
    );

    // Create response payload with all required fields
    const responsePayload = {
      success: true, // Add success field
      accessToken,
      refreshToken,
      isAdmin: validUser.isAdmin || false,
      isUser: validUser.isUser || true,
      username: validUser.username,
      email: validUser.email,
      _id: validUser._id,
      statusCode: 200
    };

    res.status(200).json(responsePayload);

  } catch (error) {
    console.error('SignIn error:', error);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(errorHandler(403, "No authorization header provided"));
  }

  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const [refreshToken, accessToken] = authHeader.split(",");

    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) return next(errorHandler(403, "Invalid refresh token"));
    if (user.refreshToken !== refreshToken) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    const newAccessToken = Jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
    
    const newRefreshToken = Jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Update refresh token in database
    await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });

    res.status(200).json({ 
      success: true,
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });

  } catch (error) {
    console.error('RefreshToken error:', error);
    next(errorHandler(500, "Error in refreshToken controller"));
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();
    
    if (user && !user.isUser) {
      return next(errorHandler(409, "Email already in use as a vendor"));
    }
    
    if (user) {
      const { password: hashedPassword, ...rest } = user;
      const token = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);

      res.status(200).json({
        success: true,
        accessToken: token,
        ...rest
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        profilePicture: req.body.photo,
        password: hashedPassword,
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        isUser: true,
      });
      
      const savedUser = await newUser.save();
      const token = Jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN);
      const { password: hashedPassword2, ...rest } = savedUser.toObject();
      
      res.status(200).json({
        success: true,
        accessToken: token,
        ...rest
      });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    next(error);
  }
};
