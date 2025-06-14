import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/note.js';
import cookieParser from 'cookie-parser';

const app=express();

dotenv.config();
//app.use (cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // allow cookies
}));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(5000, () => console.log("Server started on port 5000"));