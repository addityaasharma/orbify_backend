import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    panel: { type: mongoose.Schema.Types.ObjectId, ref: "WebsitePanel" },
    name: { type: String },
    logo: { type: String },
    slug: { type: String }
});

export const Category = mongoose.model('Category', categorySchema)