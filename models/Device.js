import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["door", "camera", "sensor"], required: true },
  status: { type: Boolean, default: false },
  apiEndpoint: { type: String, default: "" },
});

export default mongoose.model("Device", deviceSchema);
