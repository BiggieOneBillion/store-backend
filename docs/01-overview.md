# Multi-Store E-Commerce Backend - Overview

## Introduction

This is a robust, production-ready RESTful API backend for a multi-store e-commerce platform built with Node.js and Express.js. The system allows multiple sellers to create and manage their own stores, list products, and process orders, while buyers can browse products across all stores, manage wishlists, and complete purchases.

## Purpose

The platform serves as a comprehensive e-commerce solution that supports:

- **Multi-tenancy**: Multiple independent stores operating on a single platform
- **Role-based access**: Buyers, sellers, and administrators with distinct permissions
- **Complete e-commerce workflow**: From product browsing to payment processing
- **Inventory management**: Stock tracking and low-stock alerts
- **Payment integration**: Secure payment processing via Paystack
- **Discount system**: Flexible coupon and discount management

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.20.4 | JavaScript runtime environment |
| **Express.js** | ^4.17.1 | Web application framework |
| **MongoDB** | ^8.18.0 | NoSQL database |
| **Mongoose** | ^8.18.0 | MongoDB ODM |

### Authentication & Security

- **Passport.js** (^0.4.0) - Authentication middleware
- **JWT** (^9.0.2) - Token-based authentication
- **bcryptjs** (^2.4.3) - Password hashing
- **Helmet** (^4.1.0) - Security headers
- **express-rate-limit** (^5.0.0) - Rate limiting
- **xss-clean** (^0.1.1) - XSS protection
- **express-mongo-sanitize** (^2.0.0) - NoSQL injection prevention

### Payment Integration

- **Paystack Node** (^0.3.0) - Payment gateway integration
- **Axios** (^1.8.1) - HTTP client for API calls

### File Management

- **Cloudinary** (^2.5.1) - Cloud-based image storage and management
- **Multer** (^1.4.5-lts.1) - File upload handling
- **express-fileupload** (^1.5.1) - Alternative file upload middleware

### Validation & Data Processing

- **Joi** (^17.3.0) - Schema validation
- **Validator** (^13.0.0) - String validation and sanitization

### Email & Communication

- **Nodemailer** (^6.3.1) - Email sending
- **Moment** (^2.24.0) - Date/time manipulation

### Development & Production Tools

- **PM2** (^5.1.0) - Process manager for production
- **Morgan** (^1.9.1) - HTTP request logger
- **Winston** (^3.2.1) - Application logging
- **Compression** (^1.7.4) - Response compression
- **CORS** (^2.8.5) - Cross-origin resource sharing

### API Documentation

- **Swagger JSDoc** (^6.0.8) - API documentation generation
- **Swagger UI Express** (^4.1.6) - Interactive API documentation UI

### Testing & Code Quality

- **Jest** (^26.0.1) - Testing framework
- **ESLint** (^7.0.0) - Code linting
- **Prettier** (^2.0.5) - Code formatting
- **Husky** (7.0.4) - Git hooks

## Key Features

### User Management
- User registration and authentication
- Email verification
- Password reset functionality
- Role-based access control (Buyer, Seller, Admin)
- User profile management
- Multiple address management

### Store Management
- Store creation and customization
- Store branding (logo, banner)
- Store status management (active, inactive, suspended)
- Store ratings and reviews

### Product Management
- Product CRUD operations
- Product variants (size, color, etc.)
- Product images (multiple images per product)
- Product specifications
- Inventory tracking
- Stock history
- Low stock alerts
- Product categorization
- Product tags (latest, featured, sale, regular)

### Shopping Experience
- Product browsing and filtering
- Product search with text indexing
- Related products
- Wishlist management
- Shopping cart functionality

### Order Management
- Order creation and tracking
- Order status workflow (awaiting_payment → processing → shipped → delivered)
- Order history
- Payment tracking

### Payment Processing
- Paystack integration
- Payment initialization
- Payment verification
- Payment status tracking
- Secure transaction handling

### Discount System
- Coupon code management
- Percentage and fixed discounts
- Product-specific discounts
- Category-wide discounts
- Variant-specific discounts
- Discount validation and application
- Time-bound discounts

### Category Management
- Hierarchical categories
- Category slugs for SEO
- Featured categories
- Subcategory support

### Inventory Management
- Real-time stock tracking
- Stock history logging
- Low stock threshold alerts
- Stock movement tracking (restock, sale, adjustment)

### Security Features
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- XSS protection
- NoSQL injection prevention
- Rate limiting on authentication endpoints
- Secure HTTP headers
- CORS configuration
- Request sanitization

## Architecture Highlights

- **Feature-based modular architecture** for scalability and maintainability
- **Separation of concerns** with distinct layers (routes, controllers, services, models)
- **Middleware-driven** request processing pipeline
- **Centralized error handling**
- **Schema validation** at the API layer
- **Plugin-based model extensions** (pagination, JSON transformation)
- **Environment-based configuration**

## Getting Started

### Prerequisites

- Node.js 18.20.4 or higher
- MongoDB database
- Cloudinary account (for image storage)
- Paystack account (for payment processing)
- SMTP server (for email notifications)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd server

# Install dependencies
yarn install
# or
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Environment
NODE_ENV=development

# Server
PORT=3000

# Database
MONGODB_URL=mongodb://localhost:27017/multi-store

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=noreply@example.com

# Paystack
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_CALLBACK_URL=http://localhost:3000/v1/paystack/verify

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Running the Application

```bash
# Development mode with auto-reload
yarn dev
# or
npm run dev

# Production mode with PM2
yarn start
# or
npm start
```

### API Documentation

When running in development mode, access the interactive API documentation at:

```
http://localhost:3000/v1/docs
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── features/        # Feature modules (v1)
│   │   └── v1/
│   │       ├── auth/
│   │       ├── user/
│   │       ├── store/
│   │       ├── product/
│   │       ├── order/
│   │       ├── payment/
│   │       ├── wishlist/
│   │       ├── discount/
│   │       ├── category/
│   │       ├── inventory/
│   │       └── ...
│   ├── middlewares/     # Custom middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── validations/     # Validation schemas
│   ├── app.js           # Express app configuration
│   └── index.js         # Application entry point
├── docs/                # Documentation
├── uploads/             # Temporary file uploads
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── ecosystem.config.json # PM2 configuration
```

## API Versioning

The API is versioned with all endpoints prefixed with `/v1/`. This allows for future API versions without breaking existing integrations.

## Next Steps

- [Architecture Documentation](./02-architecture.md) - Understand the system architecture
- [System Flow](./03-system-flow.md) - Learn how the system processes requests
- [API Endpoints](./05-api-endpoints.md) - Explore all available endpoints
- [Authentication](./07-authentication.md) - Understand the authentication system
