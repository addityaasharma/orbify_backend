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
    'https://blog-one-29va.onrender.com'
];

export const dynamicCorsMiddleware = async (req, callback) => {
    const origin = req.header('Origin');
    if (!origin) return callback(null, { origin: false });

    try {
        if (dashboardOrigins.includes(origin)) {
            return callback(null, { origin: true });
        }

        const allowed = await Website.findOne({ domain: origin, status: "active" });

        if (allowed) {
            callback(null, { origin: true });
        } else {
            callback(new Error(`CORS blocked: ${origin}`), { origin: false });
        }
    } catch (err) {
        callback(err, { origin: false });
    }
};
