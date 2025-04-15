import express from "express";
import cookieParser from "cookie-parser";
import usersRouter from "./src/routes/users.js";
import cors from "cors";

console.log("Testing API server startup...");

try {
  const app = express();
  
  // Middleware
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  
  // Mount routes
  console.log("Mounting users router at /users prefix...");
  app.use('/users', usersRouter);
  
  app.get('/test', (req, res) => {
    res.json({ message: "API is working!" });
  });
  
  // Start server on test port
  const PORT = 4001;
  const server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log("If you see this message without errors, your API should start up correctly");
    console.log("\nAvailable routes:");
    
    // Log registered routes
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
              const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
              console.log(`${methods} ${prefixPath}${path}`);
            } catch (e) {
              // Skip if we can't determine the path
            }
          }
        });
      }
    });
    
    console.log("\nPress Ctrl+C to exit");
  });
  
  // Shutdown after 10 seconds
  setTimeout(() => {
    console.log("Shutting down test server...");
    server.close();
  }, 10000);
  
} catch (error) {
  console.error("Error starting test server:", error);
} 