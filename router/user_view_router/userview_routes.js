import express from "express";
import { userBanners, userBlogs, userCategories } from "../../controller/user_view_controller/user_data.js";

const publicRouter = express.Router()

publicRouter.get('/blogs', userBlogs)
publicRouter.get('/banners', userBanners)
publicRouter.get('/categories', userCategories)

export default publicRouter;