import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  image: { type: String, required: true }, // base64 string
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Image", imageSchema);
