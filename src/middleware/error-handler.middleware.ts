import { Request, Response, NextFunction } from 'express';
import { ValidationError, DuplicateError, DatabaseError } from '../utils/error-classes';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', error);

    if (error instanceof ValidationError) {
        res.status(400).json({
            success: false,
            error: {
                message: error.message,
                type: 'ValidationError'
            }
        });
        return;
    }

    if (error instanceof DuplicateError) {
        res.status(409).json({
            success: false,
            error: {
                message: error.message,
                type: 'DuplicateError'
            }
        });
        return;
    }

    if (error instanceof DatabaseError) {
        res.status(500).json({
            success: false,
            error: {
                message: error.message,
                type: 'DatabaseError'
            }
        });
        return;
    }

    // Default error response
    res.status(500).json({
        success: false,
        error: {
            message: 'An unexpected error occurred',
            type: 'InternalServerError'
        }
    });
};