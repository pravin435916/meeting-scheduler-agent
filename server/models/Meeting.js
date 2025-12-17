import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled"
  },

  autoRescheduled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Meeting", meetingSchema);
