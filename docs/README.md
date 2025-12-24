# Multi-Store E-Commerce Backend - Documentation

Welcome to the comprehensive documentation for the Multi-Store E-Commerce Backend API. This documentation provides detailed information about the system architecture, API endpoints, authentication, payment integration, and deployment.

## 📚 Documentation Index

### Getting Started

1. **[Overview](./01-overview.md)**
   - Introduction and project purpose
   - Technology stack
   - Key features
   - Installation and setup
   - Quick start guide

2. **[Getting Started](./getting-started.md)**
   - Prerequisites
   - Detailed installation steps
   - Running development/production modes

3. **[Tech Stack](./tech-stack.md)**
   - Detailed technology breakdown
   - Rationale for choices

4. **[Environment Variables](./environment-variables.md)**
   - Complete configuration reference
   - Required and optional variables

### Architecture & Design

2. **[Architecture](./02-architecture.md)**
   - Architectural patterns
   - Feature-based modular structure
   - Design considerations
   - Middleware architecture
   - Error handling strategy
   - Project structure

3. **[System Flow](./03-system-flow.md)**
   - System architecture diagrams
   - Request/Response lifecycle
   - Authentication flows
   - Payment processing flows
   - Order fulfillment flows
   - Inventory management flows

4. **[User Flows](./04-user-flows.md)**
   - Buyer journey maps
   - Seller workflows
   - Admin operations
   - Common user scenarios
   - User pain points and solutions

### API Reference

5. **[API Endpoints](./05-api-endpoints.md)**
   - Complete endpoint reference
   - Request/Response examples

6. **[API Usage Guide](./api-usage-guide.md)**
   - Practical workflow examples
   - Authentication step-by-step
   - Common query parameters

6. **[Data Models](./06-data-models.md)**
   - Database schema documentation
   - Entity relationship diagrams
   - Model definitions
   - Field validations
   - Indexes and performance
   - Relationships

### Security & Integration

7. **[Authentication](./07-authentication.md)**
   - JWT authentication strategy
   - Dual-token system
   - Passport.js configuration
   - Role-based access control (RBAC)
   - Password security
   - Email verification
   - Security best practices

8. **[Payment Integration](./08-payment-integration.md)**
   - Paystack integration
   - Payment initialization
   - Payment verification
   - Webhook handling
   - Error handling
   - Testing and security

### Deployment

9. **[Deployment](./09-deployment.md)**
   - Environment configuration
   - PM2 process management
   - Nginx configuration
   - SSL certificates

10. **[Render Deployment](./deployment-render.md)**
    - Hosting on Render
    - MongoDB Atlas setup

11. **[Netlify Guide](./deployment-netlify.md)**
    - Serverless architecture
    - Limitations and alternatives

## 🚀 Quick Links

### For Developers

- **Getting Started**: Start with [Overview](./01-overview.md) for installation and setup
- **API Development**: Check [API Endpoints](./05-api-endpoints.md) for endpoint reference
- **Database**: See [Data Models](./06-data-models.md) for schema details
- **Authentication**: Review [Authentication](./07-authentication.md) for auth implementation

### For DevOps

- **Deployment**: Follow [Deployment Guide](./09-deployment.md) for production setup
- **Architecture**: Understand [System Architecture](./02-architecture.md)
- **Monitoring**: Check deployment guide for monitoring setup

### For Product Managers

- **Features**: See [Overview](./01-overview.md) for feature list
- **User Flows**: Review [User Flows](./04-user-flows.md) for user journeys
- **System Flow**: Understand [System Flow](./03-system-flow.md) for process diagrams

## 🎯 Key Features

- **Multi-Store Platform**: Support for multiple independent stores
- **Role-Based Access**: Buyers, sellers, and administrators
- **Product Management**: Full CRUD with variants, images, and inventory
- **Order Processing**: Complete order lifecycle management
- **Payment Integration**: Secure Paystack payment gateway
- **Discount System**: Flexible coupons and discounts
- **Inventory Tracking**: Real-time stock management
- **Email Notifications**: Automated email workflows
- **Search & Filter**: Advanced product search capabilities
- **Wishlist**: Save products for later
- **Address Management**: Multiple shipping addresses

## 🛠️ Technology Stack

- **Runtime**: Node.js 18.20.4
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Payment**: Paystack
- **File Storage**: Cloudinary
- **Process Manager**: PM2
- **Documentation**: Swagger

## 📖 Documentation Structure

```
docs/
├── 01-overview.md              # Project introduction and setup
├── 02-architecture.md          # System architecture and design
├── 03-system-flow.md           # Flow diagrams and processes
├── 04-user-flows.md            # User journey maps
├── 05-api-endpoints.md         # Complete API reference
├── 06-data-models.md           # Database schemas
├── 07-authentication.md        # Auth system details
├── 08-payment-integration.md   # Payment processing
├── 09-deployment.md            # Deployment guide
└── README.md                   # This file
```

## 🔗 API Base URL

- **Development**: `http://localhost:3000/v1`
- **Production**: `https://api.yourstore.com/v1`

## 📝 API Documentation (Swagger)

Interactive API documentation is available in development mode:

```
http://localhost:3000/v1/docs
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:

```http
Authorization: Bearer {access_token}
```

See [Authentication Documentation](./07-authentication.md) for details.

## 🌐 Supported Endpoints

| Category | Endpoints | Documentation |
|----------|-----------|---------------|
| **Authentication** | `/v1/auth/*` | [Auth Endpoints](./05-api-endpoints.md#authentication) |
| **Users** | `/v1/users/*` | [User Endpoints](./05-api-endpoints.md#users) |
| **Stores** | `/v1/store/*` | [Store Endpoints](./05-api-endpoints.md#stores) |
| **Products** | `/v1/product/*` | [Product Endpoints](./05-api-endpoints.md#products) |
| **Orders** | `/v1/order/*` | [Order Endpoints](./05-api-endpoints.md#orders) |
| **Wishlist** | `/v1/wishlist/*` | [Wishlist Endpoints](./05-api-endpoints.md#wishlist) |
| **Payment** | `/v1/paystack/*` | [Payment Endpoints](./05-api-endpoints.md#paystack) |
| **Discounts** | `/v1/discount/*` | [Discount Endpoints](./05-api-endpoints.md#discounts) |
| **Categories** | `/v1/categories/*` | [Category Endpoints](./05-api-endpoints.md#categories) |

## 🎨 Diagrams & Visualizations

The documentation includes comprehensive diagrams created with Mermaid:

- **Architecture Diagrams**: System components and layers
- **Sequence Diagrams**: Request/response flows
- **State Diagrams**: Order and payment states
- **ER Diagrams**: Database relationships
- **Journey Maps**: User experience flows

## 🤝 Contributing

When contributing to the documentation:

1. Follow the existing structure and formatting
2. Use Mermaid for diagrams
3. Include code examples where applicable
4. Keep explanations clear and concise
5. Update the index when adding new sections

## 📞 Support

For questions or issues:

- Review the relevant documentation section
- Check the [API Endpoints](./05-api-endpoints.md) for endpoint details
- See [Deployment Guide](./09-deployment.md) for production issues
- Refer to [Troubleshooting](./09-deployment.md#troubleshooting) section

## 📄 License

This project is licensed under the MIT License.

## 🔄 Version

**API Version**: v1  
**Documentation Last Updated**: 2024-01-01

---

**Next Steps:**
- New to the project? Start with [Overview](./01-overview.md)
- Setting up locally? Check [Installation Guide](./01-overview.md#getting-started)
- Deploying to production? Follow [Deployment Guide](./09-deployment.md)
- Integrating the API? See [API Endpoints](./05-api-endpoints.md)
