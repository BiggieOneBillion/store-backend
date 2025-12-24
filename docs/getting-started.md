# Getting Started Guide

Follow this guide to get the Multi-Store E-Commerce Backend up and running on your local machine for development and testing.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.20.4 or highter
- **Yarn** or **NPM**: Package managers
- **MongoDB**: A local instance or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Git**: For version control

## Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install Dependencies**
   Using Yarn:
   ```bash
   yarn install
   ```
   Using NPM:
   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables**
   Create a `.env` file in the root directory by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and fill in the required values. See the [Environment Variables Guide](./environment-variables.md) for a detailed breakdown of all variables.

2. **Wait for Database Initialization**
   The application automatically initializes the database on first run, including creating a default administrator if one doesn't exist.

## Running the Application

### Development Mode
Runs the server with `nodemon` for automatic restarts on file changes:
```bash
yarn dev
# or
npm run dev
```

### Production Mode
Builds and starts the application using PM2 (for process management):
```bash
yarn start
# or
npm start
```

## Verifying the Setup

Once the server is running (default port: 3000), you can verify it by:

1. **Health Check**
   Open your browser and navigate to `http://localhost:3000/v1/docs` to see the Swagger documentation.

2. **Initial Admin User**
   Check the console logs to see the credentials for the default admin user created during initialization.

## Essential Scripts

- `yarn lint`: Run ESLint to check for code quality issues.
- `yarn lint:fix`: Automatically fix linting issues.
- `yarn prettier`: Check code formatting.
- `yarn prettier:fix`: Format code according to Prettier rules.
- `yarn test`: Run the test suite using Jest.

## Common Issues & Troubleshooting

- **MongoDB Connection Error**: Ensure your MongoDB service is running or check your connection string in the `.env` file.
- **Port Already in Use**: If port 3000 is occupied, change the `PORT` variable in your `.env` file.
- **Missing Dependencies**: Run `yarn install` again to ensure all packages are correctly installed.

For more detailed information on specific features, refer to the other documents in the `docs` folder.
