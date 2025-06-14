import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [
  {
    url: String,
    public_id: String
  }
]
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);
