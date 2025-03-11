import mongoose from "mongoose";

const MonitorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE", "HEAD"],
    default: "GET"
  },
  headers: {
    type: Map,
    of: String,
    default: {}
  },
  body: {
    type: String,
    default: ""
  },
  interval: {
    type: Number,
    default: 5,
    min: 1,
    max: 60
  },
  timeout: {
    type: Number,
    default: 30,
    min: 5,
    max: 120
  },
  expectedStatusCode: {
    type: Number,
    default: 200
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastChecked: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ["up", "down", "pending"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.models.Monitor || mongoose.model("Monitor", MonitorSchema);