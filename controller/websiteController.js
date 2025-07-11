import crypto from "crypto";
import { Admin } from "../model/admin/adminSchema.js";
import { Website } from "../model/website/webauth/websiteSchema.js";
import { AdminPanel } from "../model/admin/adminPanelSchema.js";
import { WebsitePanel } from '../model/website/websitePanelSchema.js'
import { Blog } from '../model/website/webcontent/blogSchema.js'
import { Banner } from '../model/website/webcontent/bannerSchema.js'
import { Category } from '../model/website/webcontent/categorySchema.js'


export const addWebsite = async (req, res) => {
    const userID = req.user;
    let { name, domain, status } = req.body;

    name = name?.trim();
    domain = domain?.trim();

    if (!name || !domain) {
        return res.status(400).json({
            status: "error",
            message: "Website name and domain are required",
        });
    }

    const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?$/;
    if (!domainRegex.test(domain)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid domain format",
        });
    }

    if (status && !["active", "inactive"].includes(status)) {
        return res.status(400).json({
            status: "error",
            message: "Status must be either 'active' or 'inactive'",
        });
    }

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const existingWebsite = await Website.findOne({ domain });
        if (existingWebsite) {
            return res.status(400).json({
                status: "error",
                message: "Website with this domain already exists",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const healthURL = `${domain.replace(/\/$/, "")}/health`;

        const newWebsite = await Website.create({
            owner: admin._id,
            name,
            domain,
            token,
            healthCheckURL: healthURL,
            status: status || "active",
            adminPanel: admin.panelData,
        });

        const websitePanel = await WebsitePanel.create({
            website: newWebsite._id,
            settings: {},
            customCode: {},
        });

        newWebsite.webPanel = websitePanel._id;
        await newWebsite.save();

        await AdminPanel.findByIdAndUpdate(admin.panelData, {
            $push: { websites: newWebsite._id },
        });

        return res.status(201).json({
            status: "success",
            message: "Website added successfully",
            website: {
                id: newWebsite._id,
                name: newWebsite.name,
                domain: newWebsite.domain,
                token: newWebsite.token,
                healthCheckURL: newWebsite.healthCheckURL,
                status: newWebsite.status,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const getAllWebsite = async (req, res) => {
    const userID = req.user;

    if (!userID) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }

    try {
        const admin = await Admin.findById(userID);

        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Admin not found or unauthorized",
            });
        }

        const adminPanel = await AdminPanel.findById(admin.panelData).populate("websites");

        if (!adminPanel) {
            return res.status(404).json({
                status: "error",
                message: "Admin panel not found",
            });
        }

        return res.status(200).json({
            status: "success",
            websites: adminPanel.websites,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const getFullWebsiteData = async (req, res) => {
    const userID = req.user;
    const { webId } = req.params;

    if (!userID) {
        return res.status(403).json({
            status: "error",
            message: "Unauthorized"
        });
    }

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(409).json({
                status: "error",
                message: "Unauthorized"
            });
        }

        const website = await Website.findById(webId).populate("webPanel");
        if (!website) {
            return res.status(401).json({
                status: "error",
                message: "No website found or website is inactive",
            });
        }

        const panelId = website.webPanel?._id;
        if (!panelId) {
            return res.status(200).json({
                status: "error",
                message: "No panel data found for this website"
            });
        }

        const [blogs, categories, banners] = await Promise.all([
            Blog.find({ panel: panelId }),
            Category.find({ panel: panelId }),
            Banner.find({ panel: panelId })
        ]);

        return res.status(200).json({
            status: "success",
            website,
            panel: website.webPanel,
            blogs,
            categories,
            banners
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
