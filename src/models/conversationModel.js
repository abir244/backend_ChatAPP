// src/models/conversationModel.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true, index: true },

        // Optional but recommended:
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);