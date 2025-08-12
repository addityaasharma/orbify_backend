import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const middleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.userID
        next();
    } catch (err) {
        console.error('JWT auth error:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 'error', message: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        return res.status(500).json({ status: 'error', message: 'Server error during authentication' });
    }
}