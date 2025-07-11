import mongoose from "mongoose";
import { Admin } from "../model/admin/adminSchema.js";
import { Blog } from "../model/website/webcontent/blogSchema.js";
import { Banner } from '../model/website/webcontent/bannerSchema.js'
import { generateSlug } from '../config/slugGenerator.js'
import { Category } from "../model/website/webcontent/categorySchema.js";


// blog section
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

export const updateBlog = async (req, res) => {
    const userID = req.user;
    const { blogId } = req.params;
    const { name, description, content, panelId, category } = req.body;

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                status: "error",
                message: "Blog not found",
            });
        }

        if (name) {
            blog.name = name;
            blog.metaURL = generateSlug(name);
        }
        if (description) blog.description = description;
        if (content) blog.content = content;
        if (panelId) blog.panel = panelId;
        if (category) blog.category = category;

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/blogs/${file.filename}`);
            blog.images = newImages;
        }

        await blog.save();

        return res.status(200).json({
            status: "success",
            message: "Blog updated successfully",
            blog,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const deleteBlog = async (req, res) => {
    const userID = req.user;
    const { blogId } = req.params;

    if (!userID) {
        return res.status(403).json({
            status: "error",
            message: "Unauthorized",
        });
    }

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Admin not found",
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                status: "error",
                message: "Blog not found",
            });
        }

        await blog.deleteOne();

        return res.status(200).json({
            status: "success",
            message: "Blog deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// banner section
export const addBanner = async (req, res) => {
    const userID = req.user;
    const { title, panelId, link } = req.body;

    if (!title || !panelId || !link) {
        return res.status(400).json({
            status: "error",
            message: "Please provide title, panelId, and link",
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

        const image = req.file?.filename;
        if (!image) {
            return res.status(400).json({
                status: "error",
                message: "Please upload one banner image",
            });
        }

        const banner = await Banner.create({
            panel: panelId,
            title,
            image: `/uploads/blogs/${image}`,
            link,
        });

        return res.status(201).json({
            status: "success",
            message: "Banner created successfully",
            banner,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const editBanner = async (req, res) => {
    const userID = req.user;
    const { bannerId } = req.params;
    const { title, link, panelId } = req.body;

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                status: "error",
                message: "Banner not found",
            });
        }

        if (title) banner.title = title;
        if (link) banner.link = link;
        if (panelId) banner.panel = panelId;
        if (req.file) {
            banner.image = `/uploads/blogs/${req.file.filename}`;
        }

        await banner.save();

        return res.status(200).json({
            status: "success",
            message: "Banner updated successfully",
            banner,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const deleteBanner = async (req, res) => {
    const userID = req.user;
    const { bannerId } = req.params;

    if (!userID) {
        return res.status(403).json({
            status: "error",
            message: "Unauthorized",
        });
    }

    try {
        const admin = await Admin.findById(userID);
        if (!admin) {
            return res.status(403).json({
                status: "error",
                message: "Admin not found",
            });
        }

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                status: "error",
                message: "Banner not found",
            });
        }

        await banner.deleteOne();

        return res.status(200).json({
            status: "success",
            message: "Banner deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// category section
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