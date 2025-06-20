import "dotenv/config";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";

const app = express();

app.use(
	cors({
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
		methods: ["GET", "POST", "OPTIONS"],
		origin: process.env.CORS_ORIGIN || "",
	}),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(
	"/trpc",
	createExpressMiddleware({
		createContext,
		router: appRouter,
	}),
);

app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
