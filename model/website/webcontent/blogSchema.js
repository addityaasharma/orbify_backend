import e from "express";
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    panel: { type: mongoose.Schema.Types.ObjectId, ref: "WebsitePanel" },
    name: String,
    description: String,
    metaURL: String,
    category : String,
    images: [{
        type: String,
    }],
    content: {
        type: String,
    }
}, { timestamps: true })

export const Blog = mongoose.model('Blog', blogSchema) 