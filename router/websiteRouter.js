import express from 'express'
import { middleware } from '../config/middleware.js';

const router = express.Router()

router.post('/website', middleware, adminSignupOTP)

export default router;