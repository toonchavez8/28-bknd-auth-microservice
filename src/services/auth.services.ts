
import { AppDataSource } from "../utils/app-data-source";
import { User } from "../entities/user.entity";

export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);

    const newUser = userRepository.create({
        username,
        email,
        password
    });
    await userRepository.save(newUser);
    return newUser;
};

export const loginUser = async (username: string, password: string): Promise<User | null> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username, password });
    return user || null;
};

export const hashPassword = async (password: string): Promise<string> => {
    // Implement password hashing logic here (e.g., using bcrypt)
    return password; // Placeholder, replace with hashed password
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    // Implement password comparison logic here (e.g., using bcrypt)
    return plainPassword === hashedPassword; // Placeholder, replace with actual comparison
}   

export const generateToken = (user: User): string => {
    // Implement JWT token generation logic here
    return "token"; // Placeholder, replace with actual token
}
