# Hello World Final Project

This project includes an API with authentication and item management functionality. 

## Setup Instructions

1. Run the setup script to install dependencies and set up the database:
   ```
   npm run setup
   ```

2. Start the API server:
   ```
   npm run dev:api
   ```

## API Features

- Authentication (register, login, logout)
- Item management (list items, create items)
- JWT-based authentication with HTTP-only cookies
- Prisma ORM with SQLite database

## Available Endpoints

- Authentication:
  - POST /register
  - POST /login
  - POST /logout

- Items:
  - GET /ping - Test endpoint
  - GET /items - Get all items
  - POST /items - Create a new item (requires authentication)

See the API README.md for more detailed information.  