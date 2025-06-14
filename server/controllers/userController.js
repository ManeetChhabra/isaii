import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Generate JWT Token & Set Cookie
const generateToken = (res, user) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  // console.log("Generated JWT Token:", token);
  res.cookie("jwt", token, { httpOnly: true });
  return token;
  // res.json({ token, userData: user, role: user.role });
};

// User Signup
export const register = async (req, res) => {
  console.log("Signup Controller Hit!");
  console.log("Request Body:", req.body);
  try {
    const {
      username,
      email,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      
    });

    generateToken(res, user);
    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  console.log("login Controller Hit!");
  console.log("Request Body:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token =generateToken(res, user);
    return res.status(200).json({
      token,
      
      userData: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// User Logout
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
};

