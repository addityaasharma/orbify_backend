import mongoose from "mongoose";

const panelSchema = new mongoose.Schema({
    websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }],
}, { timestamps: true })

export const AdminPanel = mongoose.model('AdminPanel', panelSchema)