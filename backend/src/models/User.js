import mongoose from "mongoose";

/**
 * Roles:
 * - admin: add/update resources, approve/cancel bookings
 * - user: view resources, request booking
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin","user"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
