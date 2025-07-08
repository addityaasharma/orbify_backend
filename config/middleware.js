import jwt from 'jsonwebtoken'

export const middleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized: Token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Optional: check for user existence in DB if needed
        // const user = await User.findById(decoded.id);
        // if (!user) return res.status(401).json({ message: 'Invalid user' });

        req.user = decoded; // You can attach full user object if you query DB

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
