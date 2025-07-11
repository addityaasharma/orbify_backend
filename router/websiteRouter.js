import express from 'express'
import { middleware } from '../config/middleware.js';
import { addWebsite, getFullWebsiteData, getAllWebsite } from '../controller/websiteController.js';

const router = express.Router()

router.post('/website', middleware, addWebsite)
router.get('/website', middleware, getAllWebsite)
router.get('/website/:webId', middleware, getFullWebsiteData)

export default router;