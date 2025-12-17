import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";

// Constants
export const SALT_ROUNDS = 10;
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3d";
// Helper functions (keeping them for modularity)


export const hashPassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new Error("Failed to hash password");
    }
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    // Implement password comparison logic here (e.g., using bcrypt)
    return plainPassword === hashedPassword; // Placeholder, replace with actual comparison
}   

export const generateToken = (user: User): string => {
    // Implement JWT token generation logic here
    return "token"; // Placeholder, replace with actual token
}
