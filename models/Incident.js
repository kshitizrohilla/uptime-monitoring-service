import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema({
  monitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number
  },
  reason: {
    type: String
  },
  statusCode: {
    type: Number
  },
  resolved: {
    type: Boolean,
    default: false
  }
});

export default mongoose.models.Incident || mongoose.model("Incident", IncidentSchema);