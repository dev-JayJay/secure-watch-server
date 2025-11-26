import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized no token provided',
            status: 'error',
            data: null,
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Invalid or expired token',
            status: 'error',
            data: null,
        });
    }
}
