import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

export const server = () => {
    mongoose.connect(MONGO_URI).then(() => {
        console.log('Server Connected')
    }).catch((e) => {
        console.log('Something error happened', e)
    })
}

const dashboardOrigins = [
    'https://dashboard.orbify.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://blog-one-29va.onrender.com',
    'https://multitenantsystem.onrender.com',
    'https://blog-two.onrender.com'
];

export const dynamicCorsMiddleware = async (req, callback) => {
    const origin = req.header('Origin');

    if (!origin) return callback(null, { origin: true });

    try {
        if (dashboardOrigins.includes(origin)) {
            return callback(null, { origin: true });
        }

        if (mongoose.connection.readyState !== 1) {
            console.warn('DB not connected, skipping CORS DB check');
            return callback(null, { origin: false });
        }

        const allowed = await Website.findOne({ domain: origin, status: "active" });

        if (allowed) {
            callback(null, { origin: true });
        } else {
            console.warn(`CORS blocked: ${origin}`);
            callback(null, { origin: false });
        }
    } catch (err) {
        console.error("CORS check failed:", err);
        callback(null, { origin: false });
    }
};
