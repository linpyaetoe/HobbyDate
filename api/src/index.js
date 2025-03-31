import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(authRouter);
app.use(eventsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});