import express from 'express'
import { adminCompleteSignUp, adminLogin, adminSignupOTP } from '../controller/adminAuthController.js';

const router = express.Router()

router.post('/signup',adminSignupOTP)
router.post('/verify_signup', adminCompleteSignUp)
router.post('/login',adminLogin)

export default router;