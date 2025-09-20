import express from "express";
import cors from "cors";
import routes from "./api/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
	res.status(200).json({ status: "Backend is running" });
});

export default app;

