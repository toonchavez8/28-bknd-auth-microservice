import { ValidationError } from "./error-classes";


export const validateUserInput = (username: string, email: string, password: string): void => {
    if (!username || username.trim().length === 0) {
        throw new ValidationError("Username is required");
    }
    
    if (!email || email.trim().length === 0) {
        throw new ValidationError("Email is required");
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ValidationError("Invalid email format");
    }
    
    if (!password || password.trim().length === 0) {
        throw new ValidationError("Password is required");
    }
    
    if (password.trim().length < 6) {
        throw new ValidationError("Password must be at least 6 characters long");
    }
};