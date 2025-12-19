import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/error-classes';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Username, email, and password are required',
                type: 'ValidationError'
            }
        });
        return;
    }

    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            success: false,
            error: {
                message: 'Username and password are required',
                type: 'ValidationError'
            }
        });
        return;
    }

    next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
        res.status(400).json({
            success: false,
            error: {
                message: 'At least one field (username, email, or password) is required for update',
                type: 'ValidationError'
            }
        });
        return;
    }

    next();
};