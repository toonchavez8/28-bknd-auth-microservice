import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth.services';
import { ValidationError, DuplicateError, DatabaseError } from '../utils/error-classes';

/**
 * Handles POST /api/auth/register requests
 * Registers a new user with username, email, and password
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // Call the service layer to register the user
        const result = await registerUser(username, email, password);

        // Send success response
        res.status(201).json({
            success: true,
            data: {
                userId: result.userID,
                message: result.message
            }
        });
    } catch (error) {
        // Handle validation errors
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

        // Handle duplicate errors (username or email already exists)
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

        // Handle database errors
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

        // Handle unexpected errors
        res.status(500).json({
            success: false,
            error: {
                message: 'An unexpected error occurred',
                type: 'InternalServerError'
            }
        });
    }
};

/**
 * Handles POST /api/auth/login requests
 * Authenticates a user and returns an access token
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Call the service layer to authenticate the user
        const result = await loginUser(username, password);

        // Send success response with token
        res.status(200).json({
            success: true,
            data: {
                accessToken: result.accessToken,
                tokenType: result.tokenType,
                expiresIn: result.expiresIn
            }
        });
    } catch (error) {
        // Handle validation errors (invalid credentials)
        if (error instanceof ValidationError) {
            res.status(401).json({
                success: false,
                error: {
                    message: error.message,
                    type: 'AuthenticationError'
                }
            });
            return;
        }

        // Handle database errors
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

        // Handle unexpected errors
        res.status(500).json({
            success: false,
            error: {
                message: 'An unexpected error occurred',
                type: 'InternalServerError'
            }
        });
    }
};
