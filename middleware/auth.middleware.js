import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        // Bearer token
        const token = req.headers.authorization

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        req.auth = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            userName: decoded.userName,
            phoneNumber: decoded.phoneNumber,
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

}