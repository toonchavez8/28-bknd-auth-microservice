import { Request, Response, Router } from "express";
import { AppDataSource } from "../utils/app-data-source";
import { User } from "../entities/user.entity";
import chalk from "chalk";

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
        const userRepository = AppDataSource.getRepository(User);	
        const newUser = userRepository.create({
            username,
            email,
            password,
            createdAt: new Date()
        });
        await userRepository.save(newUser);
        res.status(201).json(newUser);
    } catch (error:any) {
        switch (error.number) {
            case 23505: // Unique violation error code for PostgreSQL
                res.status(409).json({ message: "Username or email already exists" });
                break;
            case 2627: // Unique violation error code for MSSQL
                console.error("Unique constraint violation:", error.message);
                res.status(409).json({ message: "Username or email already exists" });
                break;
            case 515: // Cannot insert the value NULL error code for MSSQL
                console.error("Cannot insert NULL value:", error.message);
                res.status(400).json({ message: "Missing required fields" });
                break;
            default:
                console.error("Error creating user:", error);
                res.status(500).json({ message: "Internal server error" });
        }
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