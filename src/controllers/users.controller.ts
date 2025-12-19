import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../utils/app-data-source';
import { User } from '../entities/user.entity';
import { DatabaseError, NotFoundError } from '../utils/error-classes';
import chalk from 'chalk';

/**
 * Handles GET /api/users requests
 * Retrieves all users from the database
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        
        console.log(chalk.blueBright("Fetched all users successfully"));
        
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error(chalk.red("Error fetching users:", error));
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch users',
                type: 'DatabaseError'
            }
        });
    }
};

/**
 * Handles GET /api/users/:id requests
 * Retrieves a single user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        
        if (!user) {
            res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    type: 'NotFoundError'
                }
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(chalk.red("Error fetching user:", error));
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to fetch user',
                type: 'DatabaseError'
            }
        });
    }
};

/**
 * Handles PUT /api/users/:id requests
 * Updates an existing user
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        
        if (!user) {
            res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    type: 'NotFoundError'
                }
            });
            return;
        }
        
        // Update user fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        
        const updatedUser = await userRepository.save(user);
        
        console.log(chalk.green(`User updated successfully: ${userId}`));
        
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error(chalk.red("Error updating user:", error));
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to update user',
                type: 'DatabaseError'
            }
        });
    }
};

/**
 * Handles DELETE /api/users/:id requests
 * Deletes a user from the database
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.id;
    
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });
        
        if (!user) {
            res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    type: 'NotFoundError'
                }
            });
            return;
        }
        
        await userRepository.remove(user);
        
        console.log(chalk.green(`User deleted successfully: ${userId}`));
        
        res.status(200).json({
            success: true,
            data: {
                message: 'User deleted successfully'
            }
        });
    } catch (error) {
        console.error(chalk.red("Error deleting user:", error));
        
        res.status(500).json({
            success: false,
            error: {
                message: 'Failed to delete user',
                type: 'DatabaseError'
            }
        });
    }
};
