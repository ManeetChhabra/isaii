import { Note } from "../models/Note.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uploadMultipleDocuments } from "../utils/cloudinary.js";
import fs from "fs";

export const createNote = async (req, res) => {
  try {
    const files = req.files;

    // Upload files to Cloudinary
    let attachments = [];
    if (files && files.length > 0) {
      const results = await uploadMultipleDocuments(files.map(file => file.path));
      attachments = results.map(file => ({
        url: file.secure_url,
        public_id: file.public_id
      }));

      // Optional: delete local temp files after upload
      files.forEach(file => fs.unlinkSync(file.path));
    }

    const newNote = new Note({
      ...req.body,
      user: req.user.id,
      attachments
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Note creation failed." });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json("Note deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};