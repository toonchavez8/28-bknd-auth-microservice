import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'No token provided',
                    type: 'AuthenticationError'
                }
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
                id: string;
                username: string;
                email: string;
            };

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid or expired token',
                    type: 'AuthenticationError'
                }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                message: 'Authentication error',
                type: 'InternalServerError'
            }
        });
    }
};