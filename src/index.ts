import "reflect-metadata"
import express, { Request, Response } from "express"
import dotenv from "dotenv";
import chalk from 'chalk';
dotenv.config();

import { AppDataSource } from './utils/app-data-source';
import usersRouter from "./routes/users.router";
import authRouter from "./routes/auth.router";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Mount routers BEFORE the conditional server start
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    const startServer = async () => {
        try {
            await AppDataSource.initialize();
            console.log(chalk.hex("#44cf62ff")("Data Source has been initialized!"));
            
            app.listen(PORT, () => {
                console.log(chalk.green(`Server is running on http://localhost:${PORT}`));
            });
        } catch (err) {
            console.error(chalk.red("Error during Data Source initialization:"), err);
        }	
    };
    
    startServer();
}

export default app;