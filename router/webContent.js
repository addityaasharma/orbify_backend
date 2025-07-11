import express from "express";
import { middleware } from '../config/middleware.js'
import { addBanner, addBlogs, addCategory } from "../controller/websiteContent.js";
import { upload } from "../config/multer.js";

const router = express.Router()

router.post('/blog', middleware, upload.array("images", 5), addBlogs)
router.post('/banner', middleware, upload.array("images", 5), addBanner)
router.post('/category', middleware, upload.single("images"), addCategory)

export default router;