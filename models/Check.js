import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema({
  monitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monitor",
    required: true
  },
  status: {
    type: String,
    enum: ["up", "down"],
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  statusCode: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

CheckSchema.index({ monitor: 1, timestamp: -1 });
export default mongoose.models.Check || mongoose.model("Check", CheckSchema);