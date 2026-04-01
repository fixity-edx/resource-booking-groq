import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    slot: { type: String, required: true },

    status: { type: String, enum: ["pending","approved","cancelled"], default: "pending" },

    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    aiSuggestions: { type: [String], default: [] },

    actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// prevent exact duplicates once approved
bookingSchema.index({ resource: 1, date: 1, slot: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
