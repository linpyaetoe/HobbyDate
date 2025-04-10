# API Documentation

This API provides endpoints for authentication and managing items.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database:
   ```
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /register** - Register a new user
  - Request body: `{ "username": "user", "email": "user@example.com", "password": "password123" }`

- **POST /login** - Login a user
  - Request body: `{ "username": "user", "password": "password123" }`

- **POST /logout** - Logout a user

### Items

- **GET /ping** - Simple endpoint to check API responsiveness

- **GET /items** - Get all items

- **POST /items** - Create a new item (requires authentication)
  - Request body: `{ "title": "Item Title", "description": "Item description", "categoryId": 1 }` 