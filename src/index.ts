import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	console.log("Received a request at /");
	res.send("Hello, World!");
});

app.post("/", (req,res)=>{
	console.log("Received a POST request at /");
	res.send("POST request received");
});
app.put("/", (req,res)=>{
	console.log("Received a PUT request at /");
	res.send("PUT request received");
});

app.delete("/", (req,res)=>{
	console.log("Received a DELETE request at /");
	res.send("DELETE request received");
});
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
