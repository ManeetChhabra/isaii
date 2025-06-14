import express from "express";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import { deleteNote,updateNote ,getNoteById, getAllNotes ,createNote} from "../controllers/noteController.js";
import upload from "../utils/multer.js";




const router = express.Router();


router.post("/", authMiddleware, upload.array("attachments", 5), createNote);
router.get("/", authMiddleware, getAllNotes);
router.get("/:id", authMiddleware, getNoteById);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;