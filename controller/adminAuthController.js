import { Admin } from "../model/admin/adminSchema.js";
import bcrypt from 'bcrypt'
import { AdminPanel } from "../model/admin/adminPanelSchema.js";
import { sendOTP, generateOTP } from '../config/otpGen.js';
import { redisClient } from "../config/redis.js";
import jwt from 'jsonwebtoken'


export const adminSignupOTP = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please fill all the details" });
    }

    try {
        const existAdmin = await Admin.findOne({ email });
        if (existAdmin) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        const adminPanelData = await AdminPanel.create({});

        const otpResult = await sendOTP(email, username)
        if (!otpResult.success) {
            return res.status(500).json({ message: "Failed to send otp", error: otpResult.error });
        }

        const cache = `admin_signup_otp:${email}`
        await redisClient.setEx(cache, 120, JSON.stringify({
            username,
            email,
            password: hashPass,
            panelDataID: adminPanelData._id,
            otp: otpResult.otp
        }))
        console.log(cache)

        return res.status(200).json({
            status: "success",
            message: "OTP sent to email. Please verify within 2 minutes.",
        });
    } catch (error) {
        console.error("Admin Signup Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


export const adminCompleteSignUp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            status: "error",
            message: "Email and OTP are required"
        });
    }

    try {
        const cacheKey = `admin_signup_otp:${email}`;
        const cachedData = await redisClient.get(cacheKey);

        if (!cachedData) {
            return res.status(410).json({
                status: "error",
                message: "OTP expired or not found",
            });
        }

        let parsedData;
        try {
            parsedData = JSON.parse(cachedData);
            if (
                typeof parsedData !== 'object' ||
                parsedData === null ||
                !('otp' in parsedData)
            ) {
                return res.status(500).json({
                    status: "error",
                    message: "Invalid or corrupted OTP data"
                });
            }

        } catch (parseError) {
            return res.status(500).json({
                status: "error",
                message: "Failed to parse OTP data",
                error: parseError.message
            });
        }

        const { username, password, panelDataID, otp: storedOTP } = parsedData;

        if (storedOTP !== otp) {
            return res.status(401).json({
                status: "error",
                message: "Invalid OTP"
            });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                status: "error",
                message: "Admin already exists"
            });
        }

        const newAdmin = await Admin.create({
            email,
            username,
            password,
            panelData: panelDataID,
        });

        await redisClient.del(cacheKey);

        return res.status(201).json({
            status: "success",
            message: "Admin account created successfully",
            data: {
                id: newAdmin._id,
                email: newAdmin.email,
                name: newAdmin.name
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required"
        });
    }

    try {
        const adminCheck = await Admin.findOne({ email });
        if (!adminCheck) {
            return res.status(404).json({
                status: "error",
                message: "No admin found with this email"
            });
        }

        const checkPass = await bcrypt.compare(password, adminCheck.password);
        if (!checkPass) {
            return res.status(401).json({
                status: "error",
                message: "Wrong password, please try again"
            });
        }

        const token = jwt.sign(
            { userID: adminCheck._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
            data: {
                id: adminCheck._id,
                name: adminCheck.name,
                email: adminCheck.email,
                panelData: adminCheck.panelData
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};