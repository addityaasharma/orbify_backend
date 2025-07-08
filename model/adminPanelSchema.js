import mongoose from "mongoose";

const panelSchema = new mongoose.Schema({
    details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'details' }],
}, { timestamps: true })

export const AdminPanel = mongoose.model('AdminPanel', panelSchema)