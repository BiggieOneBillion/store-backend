# Tech Stack Details

This document provides a detailed breakdown of the technologies used in the Multi-Store E-Commerce Backend and the rationale behind each choice.

## Core Runtime & Framework

### [Node.js](https://nodejs.org/) (v18.20.4)
The runtime environment for the backend.
- **Why**: Asynchronous, event-driven architecture makes it highly scalable for I/O intensive applications like e-commerce. Node.js 18 (LTS) provides a stable and modern environment.

### [Express.js](https://expressjs.com/) (^4.17.1)
The web application framework.
- **Why**: Minimalist and flexible web framework that provides a robust set of features for web and mobile applications. It's the industry standard for Node.js APIs.

## Database & ODM

### [MongoDB](https://www.mongodb.com/) (^8.18.0)
The primary database.
- **Why**: NoSQL document-oriented database that allows for flexible schemas, perfect for evolving product catalogs and store data.

### [Mongoose](https://mongoosejs.com/) (^8.18.0)
Object Data Modeling (ODM) for MongoDB and Node.js.
- **Why**: Provides a straight-forward, schema-based solution to model application data, including built-in type casting, validation, and query building.

## Authentication & Security

### [Passport.js](http://www.passportjs.org/) (^0.4.0) & [JWT](https://jwt.io/) (^9.0.2)
Authentication middleware and token system.
- **Why**: Standard for securing REST APIs. JWTs allow for stateless authentication, which is scalable across multiple server instances.

### [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (^2.4.3)
Password hashing.
- **Why**: Secure hashing algorithm to protect user passwords in the database.

### Security Middlewares
- **[Helmet](https://helmetjs.github.io/)**: Sets various HTTP headers for security.
- **[express-rate-limit](https://github.com/nfriedly/express-rate-limit)**: Protects against brute-force attacks.
- **[xss-clean](https://github.com/jhlywa/xss-clean)**: Sanitizes user input to prevent Cross-Site Scripting (XSS).
- **[express-mongo-sanitize](https://github.com/ameerthehacker/express-mongo-sanitize)**: Prevents NoSQL injection attacks.

## Payment & Integrations

### [Paystack](https://paystack.com/) (^0.3.0)
Payment gateway provider.
- **Why**: Robust and popular payment gateway in target markets, providing secure transaction processing.

### [Cloudinary](https://cloudinary.com/) (^2.5.1)
Cloud-based image and video management.
- **Why**: Offloads image processing and storage, providing optimized image delivery for product galleries.

## Utility & Tooling

### [Joi](https://joi.dev/) (^17.3.0)
Object schema description language and validator.
- **Why**: Ensures that all incoming request data adheres to strict schemas before reaching the controllers.

### [Nodemailer](https://nodemailer.com/) (^6.3.1)
Module for sending emails.
- **Why**: Handles all transactional emails (account verification, password resets, order confirmations).

### [PM2](https://pm2.keymetrics.io/) (^5.1.0)
Production process manager.
- **Why**: Keeps the application alive, reloads it without downtime, and facilitates logging and load balancing.

### [Winston](https://github.com/winstonjs/winston) (^3.2.1) & [Morgan](https://github.com/expressjs/morgan) (^1.9.1)
Logging libraries.
- **Why**: Morgan logs HTTP requests while Winston handles application-level logging with different levels (info, error, debug).

## Testing & Quality Assurance

### [Jest](https://jestjs.io/) (^26.0.1) & [Supertest](https://github.com/visionmedia/supertest)
Testing framework and HTTP assertion library.
- **Why**: Provides a complete testing solution for unit and integration testing of the API.

### [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)
Linter and formatter.
- **Why**: Maintains code consistency and identifies potential bugs early in the development cycle.
