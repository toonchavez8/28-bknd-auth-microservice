
import { AppDataSource } from "../utils/app-data-source";
import { User } from "../entities/user.entity";
import { validateUserInput } from "../utils/validation-help";
import {  DatabaseError, DuplicateError, ValidationError } from "../utils/error-classes";
import { comparePassword, generateToken, hashPassword } from '../utils/helper-functions';



export const registerUser = async (
    username: string, 
    email: string, 
    password: string
): Promise<{userID: string, message: string}> => {
    try {
        validateUserInput(username, email, password);
        
        // sanitize inputs
        const sanitizedUsername = username.trim();
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();

        const userRepository = AppDataSource.getRepository(User);
        

        // Check for existing user with the same email
        const existingUserByEmail   = await userRepository.findOneBy({ email: sanitizedEmail });
        if (existingUserByEmail){
            throw new DuplicateError("Email already in use");
        }

        // Check if username is already taken
        const existingUserByUsername = await userRepository.findOneBy({ username: sanitizedUsername });
        if (existingUserByUsername) {
            throw new DuplicateError("Username already in use");
        }


        // Hash the password
        const hashedPassword = await hashPassword(sanitizedPassword);

        // crete new user entity
        const newUser = userRepository.create({
            username: sanitizedUsername,
            email: sanitizedEmail,
            password: hashedPassword
        });

        // Save the new user to the database
        const savedUser = await userRepository.save(newUser);

        return {
            userID: savedUser.id,
            message: "User registered successfully"
        };

    } catch (error) {
     // Re-throw custom errors
        if (error instanceof ValidationError || 
            error instanceof DuplicateError) {
            throw error;
        }
        
        // Handle database errors
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to register user: ${error.message}`);
        }
        
        // Unknown error
        throw new DatabaseError("An unexpected error occurred during registration");
    }
};

export const loginUser = async (username: string, password: string): Promise<{accessToken: string, tokenType: string, expiresIn: string }> => {
try {
    if (!username || !password) {
        throw new ValidationError("Username and password are required");
    }
    // sananisted inputs
    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    // Find user by username
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username: sanitizedUsername });
     if (!user) {
        throw new ValidationError("Invalid username or password");
    }


    // compare passwords
    const isPasswordValid = await comparePassword(sanitizedPassword, user.password);

    if (!isPasswordValid) {
        throw new ValidationError("password is incorrect");
    }

    // Generate access token
    const accessToken = generateToken(user);

    return {
        accessToken,
        tokenType: "Bearer",
        expiresIn: `${process.env.JWT_EXPIRATION || 24}h`
    };

} catch (error) {
    // Re-throw custom errors
        if (error instanceof ValidationError || 
            error instanceof DuplicateError ) {
            throw error;
        }
        
        // Handle database errors
        if (error instanceof Error) {
            throw new DatabaseError(`Failed to register user: ${error.message}`);
        }
        
        // Unknown error
        throw new DatabaseError("An unexpected error occurred during registration");
    }
}

