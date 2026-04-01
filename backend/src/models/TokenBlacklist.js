import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    token: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TokenBlacklist", schema);
