import mongoose, { mongo } from "mongoose";

const websitePanelSchema = new mongoose.Schema({
  website: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    unique: true,
    required: true
  },
  settings: {
    theme: String,
    logoUrl: String,
    faviconUrl: String,
    footerText: String,
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String
    }
  },
  customCode: {
    header: String,
    footer: String
  }
}, { timestamps: true });

export const WebsitePanel = mongoose.model('WebsitePanel', websitePanelSchema);
