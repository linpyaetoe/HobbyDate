import express from "express";
import usersRouter from "./src/routes/users.js";

// Set up a minimal express app
const app = express();
app.use(express.json());

// Register the users router
app.use('/users', usersRouter);

// Print out all registered routes
console.log('Registered routes:');
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    // Routes registered directly on the app
    console.log(`${Object.keys(middleware.route.methods).join(', ')} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    // Router middleware
    middleware.handle.stack.forEach(handler => {
      if (handler.route) {
        const path = handler.route.path;
        const methods = Object.keys(handler.route.methods).join(', ');
        console.log(`${methods} /users${path}`);
      }
    });
  }
});

console.log("\nTo fix the 'Not Found' error, make sure:");
console.log("1. The API server is running (npm run dev:api in the project root)");
console.log("2. The endpoint URL in your React code is correct (it should be '/users/profile')");
console.log("3. Authentication is properly set up with a valid JWT token"); 