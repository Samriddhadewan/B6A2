import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";


const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(500).json({
                    success: false,
                    message: "You are not allowed"
                })
            }
            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
            console.log({ decodedToken: decoded });
            console.log({ authToken: token });
            console.log("User role from token:", decoded.role);
            req.user = decoded;

            if (!decoded.role || (roles.length && !roles.includes(decoded.role as string))) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have access"
                });
            }
            next();
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
};

export default auth;