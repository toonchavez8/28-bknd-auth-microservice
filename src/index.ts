
import express,{Request, Response} from "express"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
	console.log("Received a request at /");
	res.send("Hello, World!");
});

app.post("/", (req: Request, res: Response) => 	{
	console.log("Received a POST request at /");
	res.send("POST request received");
});
app.put("/", (req: Request, res: Response) => {
	console.log("Received a PUT request at /");
	res.send("PUT request received");
});

app.delete("/", (req: Request, res: Response) => {
	console.log("Received a DELETE request at /");
	res.send("DELETE request received");
});
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
