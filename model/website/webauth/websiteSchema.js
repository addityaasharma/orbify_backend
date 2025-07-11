import mongoose from "mongoose";

const webSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  name: { type: String, required: true },
  domain: { type: String, required: true },
  token: { type: String, unique: true },
  healthCheckURL: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  webPanel: { type: mongoose.Schema.Types.ObjectId, ref: 'WebsitePanel' },
  adminPanel: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminPanel' },
}, { timestamps: true });

export const Website = mongoose.model('Website', webSchema);