import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    panel: { type: mongoose.Schema.Types.ObjectId, ref: "WebsitePanel" },
    title: { type: String },
    image: { type: String },
    link: { type: String }
})

export const Banner = mongoose.model('Banner', bannerSchema)