import mongoose from "mongoose";

/*
 * Defines a token schema used to send emails to reset passwords
 */
const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const Token = mongoose.model("token", tokenSchema);
export { Token };
