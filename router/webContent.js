import express from "express";
import { middleware } from '../config/middleware.js'
import { addBanner, addBlogs, addCategory, updateBlog } from "../controller/websiteContent.js";
import { upload } from "../config/multer.js";

const router = express.Router()


// blogs section
router.post('/blog', middleware, upload.array("images", 5), addBlogs)
router.put('/blogs/:blogId', middleware, upload.array('images'), updateBlog);



// banner section
router.post('/banner', middleware, upload.single("image"), addBanner)



// category section
router.post('/category', middleware, upload.single("image"), addCategory)

export default router;