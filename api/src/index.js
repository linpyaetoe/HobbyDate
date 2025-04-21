import express from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import usersRouter from "./routes/users.js";
import locationsRouter from "./routes/locations.js";
import cors from "cors";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend url
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes with correct prefixes
app.use(authRouter);
app.use(eventsRouter);
app.use('/users', usersRouter); // Mount users router with /users prefix
app.use('/locations', locationsRouter); // Mount locations router with /locations prefix

// Log registered routes
console.log('API Routes registered:');
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods).join(', ')} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach(handler => {
      if (handler.route) {
        try {
          const prefix = middleware.regexp.toString().match(/^\/\^\\\/([^\\\/]+)/);
          const prefixPath = prefix ? `/${prefix[1]}` : '';
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods).join(', ');
          console.log(`${methods} ${prefixPath}${path}`);
        } catch (e) {
          // Skip if we can't determine the path
        }
      }
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});