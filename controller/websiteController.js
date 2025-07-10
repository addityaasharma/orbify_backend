import crypto from "crypto";
import { Admin } from "../model/adminSchema.js";
import { Website } from "../model/websiteSchema.js";
import { AdminPanel } from "../model/adminPanelSchema.js";


export const addWebsite = async (req, res) => {
    const userID = req.user;
    console.log(userID)
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


export const getWebsite = async (req, res) => {
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
