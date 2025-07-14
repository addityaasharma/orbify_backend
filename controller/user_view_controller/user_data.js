import { Website } from '../../model/website/webauth/websiteSchema.js'
import { Blog } from '../../model/website/webcontent/blogSchema.js';
import { Banner } from '../../model/website/webcontent/bannerSchema.js';
import { Category } from '../../model/website/webcontent/categorySchema.js';


export const userBlogs = async (req, res) => {
    const { token, id, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!token) {
        return res.status(400).json({
            status: "error",
            message: "Token is required"
        });
    }

    try {
        const website = await Website.findOne({ token }).populate("webPanel");

        // if (!website || website.status !== "active") {
        //     return res.status(404).json({
        //         status: "error",
        //         message: "Website not found or inactive"
        //     });
        // }

        const panelId = website.webPanel?._id;
        if (!panelId) {
            return res.status(404).json({
                status: "error",
                message: "No panel data found"
            });
        }

        if (id) {
            const blog = await Blog.findOne({ _id: id, panel: panelId });
            if (!blog) {
                return res.status(404).json({
                    status: "error",
                    message: "Blog not found"
                });
            }

            return res.status(200).json({
                status: "success",
                blog
            });
        }

        const query = { panel: panelId };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            status: "success",
            blogs,
            page,
            limit,
            total
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const userCategories = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            status: "error",
            message: "Token is required"
        });
    }

    try {
        const website = await Website.findOne({ token }).populate("webPanel");

        // if (!website || website.status !== "active") {
        //     return res.status(404).json({
        //         status: "error",
        //         message: "Website not found or inactive"
        //     });
        // }

        const panelId = website.webPanel?._id;
        if (!panelId) {
            return res.status(404).json({
                status: "error",
                message: "No panel data found"
            });
        }

        const categories = await Category.find({ panel: panelId }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            categories
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const userBanners = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            status: "error",
            message: "Token is required"
        });
    }

    try {
        const website = await Website.findOne({ token }).populate("webPanel");

        // if (!website || website.status !== "active") {
        //     return res.status(404).json({
        //         status: "error",
        //         message: "Website not found or inactive"
        //     });
        // }

        const panelId = website.webPanel?._id;
        if (!panelId) {
            return res.status(404).json({
                status: "error",
                message: "No panel data found"
            });
        }

        const banners = await Banner.find({ panel: panelId }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            banners
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};