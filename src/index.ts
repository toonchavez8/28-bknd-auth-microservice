import "reflect-metadata"
import express,{Request, Response} from "express"
import dotenv from "dotenv";
dotenv.config();

import { User } from "./entities/user.entity";
import { AppDataSource } from './utils/app-data-source';


 const startServer = async () => {
	try {
		await AppDataSource.initialize();
		console.log("Data Source has been initialized!");
	} catch (err) {
		console.error("Error during Data Source initialization:", err);
	}	
};

startServer();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
	console.log("Received a request at /");
	res.send("Hello, World!");
});

app.get("/users", async (req: Request, res: Response) => {
	try {
		const userRepository = AppDataSource.getRepository(User);	
		const users =  await userRepository.find();
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Internal server error" });
	}	
});

app.get("/users/:id", async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id, 10);
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


app.post("/users", async (req: Request, res: Response) => {
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
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Internal server error" });
	}
})

app.put("/users/:id", async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id, 10);
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


app.delete("/users/:id", async (req: Request, res: Response) => {
	const userId = parseInt(req.params.id, 10);
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



app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
