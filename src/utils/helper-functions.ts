import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AuthenticationError } from "./error-classes";

// Constants
export const SALT_ROUNDS = 10;
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRATION ? Number(process.env.JWT_EXPIRATION) : 24;
// Helper functions (keeping them for modularity)


export const hashPassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new Error("Failed to hash password");
    }
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error("Failed to compare passwords");
    }
}   

export const generateToken = (user: User): string => {
    
    try {
        const payload = {
            userID: user.id,
            username: user.username,
            email: user.email
        };
        
        const options: SignOptions = {
            expiresIn: JWT_EXPIRES_IN
        };
        
        const token = jwt.sign(payload, JWT_SECRET, options);
        return token;
    } catch (error) {
        throw new AuthenticationError("Failed to generate token");
    }
}

// Token verification helper
export const verifyToken = (token: string): { id: string; email: string } => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        return decoded;
    } catch (error) {
        throw new AuthenticationError("Invalid or expired token");
    }
};