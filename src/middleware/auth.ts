import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized. Token missing."
                });
            }

            let token;

            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            } else {
                token = authHeader;
            }

            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
            
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role as string)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have the required role"
                });
            }

            next();
        } catch (err: any) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    }
};

export default auth;