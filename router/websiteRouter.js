import express from 'express'
import { middleware } from '../config/middleware.js';
import { addWebsite, getWebsite } from '../controller/websiteController.js';

const router = express.Router()

router.post('/website', middleware, addWebsite)
router.get('/website', middleware, getWebsite)

export default router;