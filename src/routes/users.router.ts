import { Request, Response, Router } from "express";
import { AppDataSource } from "../utils/app-data-source";
import { User } from "../entities/user.entity";
import chalk from "chalk";
import { registerUser } from "../services/auth.services";
import { DatabaseError, DuplicateError, ValidationError } from "../utils/error-classes";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
        try {
            const userRepository = AppDataSource.getRepository(User);	
            const users =  await userRepository.find();
            res.json(users);
            console.log(chalk.blueBright("Fetched all users successfully"));
        } catch (error) {
            console.error(chalk.red("Error fetching users:", error));
            res.status(500).json({ message: "Internal server error" });
        }	
})

router.get("/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const userRepository = AppDataSource.getRepository(User);	
        const user =  await userRepository.findOneBy({id: userId});
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const result = await registerUser(username, email, password);
        console.log(chalk.green(`User registered successfully: ${email}`));
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log(chalk.yellow(`Validation error: ${error.message}`));
            return res.status(400).json({ message: error.message });
        }
        
        if (error instanceof DuplicateError) {
            console.log(chalk.yellow(`Duplicate error: ${error.message}`));
            return res.status(409).json({ message: error.message });
        }
        
        if (error instanceof DatabaseError) {
            console.error(chalk.red(`Database error: ${error.message}`));
            return res.status(500).json({ message: "Internal server error" });
        }
        
        console.error(chalk.red("Unexpected error registering user:", error));
        res.status(500).json({ message: "Internal server error" });
    }
})
router.put("/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        const userRepository = AppDataSource.getRepository(User);	
        const user = await userRepository.findOneBy({id: userId});
        if (user) {
            user.username = username;	
            user.email = email;
            user.password = password;
            await userRepository.save(user);
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }	
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }	
});

router.delete("/:id", async (req: Request, res: Response) => {
	const userId = req.params.id;
	try {
		const userRepository = AppDataSource.getRepository(User);	
		const user = await userRepository.findOneBy({id: userId});
		if (user) {
			await userRepository.remove(user);
			res.json({ message: "User deleted successfully" });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});


export default router;