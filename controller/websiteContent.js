import mongoose from "mongoose";
import { Admin } from "../model/admin/adminSchema.js";
import { Blog } from "../model/website/webcontent/blogSchema.js";
import { Banner } from '../model/website/webcontent/bannerSchema.js'
import { generateSlug } from '../config/slugGenerator.js'
import { Category } from "../model/website/webcontent/categorySchema.js";


export const addBlogs = async (req, res) => {
    const { name, description, content, panelId, category } = req.body;
    const userID = req.user;

    if (!name || !description || !content || !panelId || !category) {
        return res.status(400).json({
            status: "error",
            message: "All fields (name, description, content, panelId, category) are required"
        });
    }

    try {
        const admin = await Admin.findById(userID)
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "No admin found"
            })
        }

        const images = req.files?.map(file => `/uploads/blogs/${file.filename}`) || [];
        const metaURL = generateSlug(name);

        const blog = await Blog.create({
            panel: panelId,
            name,
            description,
            metaURL,
            images,
            content,
            category,
        });

        return res.status(201).json({
            status: "success",
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message
        })
    }
}


export const addBanner = async (req, res) => {
    const userID = req.user;
    const { title, panelId, link, links } = req.body;

    if (!title || !panelId) {
        return res.status(400).json({
            status: "error",
            message: "Please provide title and panelId",
        });
    }

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const images = req.files?.map((file) => `/uploads/blogs/${file.filename}`) || [];

        let createdBanners = [];

        if (images.length === 1) {
            const singleLink = Array.isArray(links) ? links[0] : link;
            const banner = await Banner.create({
                panel: panelId,
                title,
                image: images[0],
                link: singleLink || "",
            });
            createdBanners.push(banner);
        } else if (images.length > 1 && Array.isArray(links) && links.length === images.length) {
            for (let i = 0; i < images.length; i++) {
                const banner = await Banner.create({
                    panel: panelId,
                    title,
                    image: images[i],
                    link: links[i] || "",
                });
                createdBanners.push(banner);
            }
        } else {
            return res.status(400).json({
                status: "error",
                message: "Number of images and links must match for multiple banners",
            });
        }

        return res.status(201).json({
            status: "success",
            message: "Banner(s) created successfully",
            banners: createdBanners,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const addCategory = async (req, res) => {
    const { name, panelId } = req.body;
    const userID = req.user;

    if (!name || !panelId) {
        return res.status(400).json({
            status: "error",
            message: "Name and panelId are required",
        });
    }

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const logo = req.file ? `/uploads/blogs/${req.file.filename}` : null;
        const slug = generateSlug(name);

        const category = await Category.create({
            panel: panelId,
            name,
            logo,
            slug,
        });

        return res.status(201).json({
            status: "success",
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};