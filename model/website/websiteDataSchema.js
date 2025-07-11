import mongoose from "mongoose";

const websiteDataSchema = new mongoose.Schema({
    website: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Website",
        required: true,
        unique: true,
    },
    categories: {
        name: {
            type: String,
        },
        logo: {
            type: String,
        },
        slug: String,
    },
    blogs: {
        name: { type: String },
        description: { type: String },
        metaURL: { type: String },
        images: { type: String },
        content: { type: String }
    },
    banner: {
        name: { type: String },
        image: { type: String },
        link: { type: String },
    }
}, { timestamps: true })

export const WebsiteData = mongoose.model('WebsiteData', websiteDataSchema)