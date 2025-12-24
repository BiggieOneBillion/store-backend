# Multi-Store E-Commerce Backend

A robust, production-ready RESTful API backend for a multi-store e-commerce platform built with Node.js, Express, and MongoDB.

## 🚀 Overview

This platform allows multiple sellers to manage independent stores while providing buyers with a seamless shopping experience across all stores. It features role-based access control, secure payment integration, and a modular architecture.

## 📚 Documentation

Detailed documentation is available in the [`docs`](./docs/README.md) directory:

### Getting Started
- **[Overview](./docs/01-overview.md)**: Project introduction and features
- **[Getting Started](./docs/getting-started.md)**: Setup and installation guide
- **[Tech Stack](./docs/tech-stack.md)**: Detailed breakdown of technologies used
- **[Environment Variables](./docs/environment-variables.md)**: Configuration reference

### Architecture & Design
- **[Architecture](./docs/02-architecture.md)**: System design and patterns
- **[System Flow](./docs/03-system-flow.md)**: Request processing and logic flows
- **[User Flows](./docs/04-user-flows.md)**: Buyer, seller, and admin journeys
- **[Data Models](./docs/06-data-models.md)**: Database schemas and entities

### API & Integration
- **[API Reference](./docs/05-api-endpoints.md)**: Complete endpoint documentation
- **[API Usage Guide](./docs/api-usage-guide.md)**: Practical examples and workflows
- **[Authentication](./docs/07-authentication.md)**: Security and JWT strategy
- **[Payment Integration](./docs/08-payment-integration.md)**: Paystack implementation details

### Deployment
- **[Deployment Guide](./docs/09-deployment.md)**: General production setup
- **[Render Deployment](./docs/deployment-render.md)**: Hosting on Render
- **[Netlify Guide](./docs/deployment-netlify.md)**: Using Netlify Functions

## 🛠️ Main Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT with Passport.js
- **Payments**: Paystack
- **Storage**: Cloudinary
- **Documentation**: Swagger/OpenAPI

## ⚡ Quick Start

```bash
# Install dependencies
yarn install

# Setup environment variables
cp .env.example .env

# Run in development mode
yarn dev
```

For more details, see the [Full Getting Started Guide](./docs/getting-started.md).

## 📄 License

This project is licensed under the MIT License.
