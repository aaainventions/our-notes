import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }, 
  doneBy: { type: String, default: "" }, 
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
