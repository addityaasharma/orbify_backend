import express from "express";
import { middleware } from '../config/middleware.js'
import { addBanner, addBlogs, addCategory, deleteBanner, deleteBlog, deleteCategory, editBanner, editCategory, updateBlog } from "../controller/websiteContent.js";
import { upload } from "../config/multer.js";

const router = express.Router()


// blogs section
router.post('/blog', middleware, upload.array("images", 5), addBlogs)
router.put('/blog/:blogId', middleware, upload.array('images'), updateBlog);
router.delete('/blog/:blogId', middleware, deleteBlog)


// banner section
router.post('/banner', middleware, upload.single("image"), addBanner)
router.put('/banner/:bannerId', middleware, upload.single('image'), editBanner);
router.delete('/banner/:bannerId', middleware, deleteBanner);


// category section
router.post('/category', middleware, upload.single("image"), addCategory)
router.put('/category/:id', middleware, upload.single("image"), editCategory)
router.delete('/category/:id', middleware, upload.single("image"), deleteCategory)

export default router;