import "reflect-metadata"
import express,{Request, Response} from "express"
import dotenv from "dotenv";
dotenv.config();

import { User } from "./entities/user.entity";
import { AppDataSource } from './utils/app-data-source';
import usersRouter from "./routes/users.router";

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

app.use("/users", usersRouter);


app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
