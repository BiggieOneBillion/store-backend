# System Flow & Diagrams

## System Architecture Flow

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Application]
        Mobile[Mobile App]
        API_Client[API Client]
    end
    
    subgraph "API Gateway Layer"
        LB[Load Balancer/PM2]
    end
    
    subgraph "Application Layer"
        Express[Express Server]
        
        subgraph "Middleware Pipeline"
            Security[Security Middleware]
            Auth[Authentication]
            Validation[Validation]
            RateLimit[Rate Limiter]
        end
        
        subgraph "Business Logic"
            Controllers[Controllers]
            Services[Services]
        end
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB)]
    end
    
    subgraph "External Services"
        Paystack[Paystack API]
        Cloudinary[Cloudinary]
        SMTP[Email Service]
    end
    
    Web --> LB
    Mobile --> LB
    API_Client --> LB
    
    LB --> Express
    Express --> Security
    Security --> Auth
    Auth --> Validation
    Validation --> RateLimit
    RateLimit --> Controllers
    
    Controllers --> Services
    Services --> MongoDB
    Services --> Paystack
    Services --> Cloudinary
    Services --> SMTP
```

## Request/Response Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant Express
    participant Middleware
    participant Controller
    participant Service
    participant Model
    participant Database
    
    Client->>Express: HTTP Request
    Express->>Middleware: Process Request
    
    Middleware->>Middleware: Security Headers (Helmet)
    Middleware->>Middleware: CORS Check
    Middleware->>Middleware: Body Parsing
    Middleware->>Middleware: Sanitization (XSS, NoSQL)
    Middleware->>Middleware: File Upload Handling
    Middleware->>Middleware: Device Detection
    
    alt Authenticated Route
        Middleware->>Middleware: JWT Verification
        Middleware->>Middleware: Role-Based Access Check
    end
    
    Middleware->>Middleware: Input Validation (Joi)
    
    alt Validation Fails
        Middleware-->>Client: 400 Bad Request
    end
    
    Middleware->>Controller: Forward Request
    Controller->>Service: Call Business Logic
    Service->>Model: Data Operations
    Model->>Database: Query/Update
    Database-->>Model: Result
    Model-->>Service: Processed Data
    Service-->>Controller: Response Data
    Controller-->>Express: HTTP Response
    Express-->>Client: JSON Response
    
    alt Error Occurs
        Service-->>Controller: Throw Error
        Controller-->>Middleware: Error
        Middleware->>Middleware: Error Converter
        Middleware->>Middleware: Error Handler
        Middleware-->>Client: Error Response
    end
```

## Authentication Flow

### User Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant AuthService
    participant UserModel
    participant Database
    participant EmailService
    
    User->>API: POST /v1/auth/register
    API->>API: Validate Input (Joi)
    API->>AuthService: register(userData)
    AuthService->>UserModel: isEmailTaken(email)
    UserModel->>Database: Check Email
    Database-->>UserModel: Email Available
    
    alt Email Already Exists
        UserModel-->>AuthService: Email Taken
        AuthService-->>API: Error
        API-->>User: 400 Email Already Taken
    end
    
    AuthService->>UserModel: create(userData)
    UserModel->>UserModel: Hash Password (bcrypt)
    UserModel->>Database: Save User
    Database-->>UserModel: User Created
    
    AuthService->>AuthService: Generate Access Token
    AuthService->>AuthService: Generate Refresh Token
    AuthService->>Database: Save Refresh Token
    
    AuthService->>EmailService: Send Verification Email
    EmailService-->>User: Verification Email
    
    AuthService-->>API: {user, tokens}
    API-->>User: 201 Created {user, tokens}
```

### Login Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant AuthService
    participant UserModel
    participant Database
    
    User->>API: POST /v1/auth/login
    API->>API: Validate Input
    API->>AuthService: login(email, password)
    AuthService->>UserModel: findOne({email})
    UserModel->>Database: Query User
    Database-->>UserModel: User Data
    
    alt User Not Found
        UserModel-->>AuthService: null
        AuthService-->>API: Error
        API-->>User: 401 Invalid Credentials
    end
    
    AuthService->>UserModel: isPasswordMatch(password)
    UserModel->>UserModel: bcrypt.compare()
    
    alt Password Mismatch
        UserModel-->>AuthService: false
        AuthService-->>API: Error
        API-->>User: 401 Invalid Credentials
    end
    
    AuthService->>AuthService: Generate Access Token
    AuthService->>AuthService: Generate Refresh Token
    AuthService->>Database: Save Refresh Token
    AuthService->>UserModel: Update isLoggedOut = false
    
    AuthService-->>API: {user, tokens}
    API-->>User: 200 OK {user, tokens}
```

### Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Passport
    participant TokenService
    participant Database
    
    Client->>API: POST /v1/auth/refresh-tokens
    Note over Client,API: Refresh Token in Body/Cookie/Header
    
    API->>Passport: Authenticate (jwt-refresh)
    Passport->>Passport: Extract Refresh Token
    Passport->>Passport: Verify JWT Signature
    Passport->>Passport: Check Token Type = REFRESH
    
    alt Invalid Token
        Passport-->>API: Authentication Failed
        API-->>Client: 401 Unauthorized
    end
    
    Passport->>Database: Find User by ID
    Database-->>Passport: User Data
    Passport->>API: User Authenticated
    
    API->>TokenService: verifyToken(refreshToken)
    TokenService->>Database: Find Token
    
    alt Token Not Found/Blacklisted
        TokenService-->>API: Invalid Token
        API-->>Client: 401 Unauthorized
    end
    
    TokenService->>Database: Delete Old Refresh Token
    TokenService->>TokenService: Generate New Access Token
    TokenService->>TokenService: Generate New Refresh Token
    TokenService->>Database: Save New Refresh Token
    
    TokenService-->>API: {access, refresh}
    API-->>Client: 200 OK {tokens}
```

## Payment Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant OrderService
    participant PaystackService
    participant Paystack
    participant Database
    
    User->>Frontend: Checkout
    Frontend->>API: POST /v1/order
    API->>OrderService: createOrder(orderData)
    OrderService->>Database: Save Order (status: awaiting_payment)
    Database-->>OrderService: Order Created
    OrderService-->>API: Order Details
    API-->>Frontend: 201 Created {order}
    
    Frontend->>API: POST /v1/paystack/initialize/:orderId
    API->>PaystackService: initializeTransaction(order, userId)
    PaystackService->>PaystackService: Calculate Amount (in kobo)
    PaystackService->>Paystack: Initialize Payment
    
    Paystack-->>PaystackService: {authorization_url, reference}
    PaystackService->>Database: Update Order Payment Info
    PaystackService-->>API: Payment Data
    API-->>Frontend: {authorization_url, reference}
    
    Frontend->>User: Redirect to Paystack
    User->>Paystack: Complete Payment
    Paystack->>User: Redirect to Callback URL
    
    User->>Frontend: Return from Paystack
    Frontend->>API: GET /v1/paystack/verify?reference=xxx
    API->>PaystackService: verifyTransaction(reference)
    PaystackService->>Paystack: Verify Payment
    
    Paystack-->>PaystackService: Payment Status
    
    alt Payment Successful
        PaystackService->>Database: Update Order Status = processing
        PaystackService->>Database: Update Payment Status = success
        PaystackService-->>API: Success
        API-->>Frontend: Payment Verified
        Frontend-->>User: Order Confirmed
    else Payment Failed
        PaystackService->>Database: Update Payment Status = failed
        PaystackService->>Database: Increment Payment Attempts
        PaystackService-->>API: Failed
        API-->>Frontend: Payment Failed
        Frontend-->>User: Payment Error
    end
```

## Order Fulfillment Flow

```mermaid
stateDiagram-v2
    [*] --> AwaitingPayment: Order Created
    
    AwaitingPayment --> PaymentFailed: Payment Fails
    AwaitingPayment --> Processing: Payment Success
    AwaitingPayment --> Cancelled: User Cancels
    
    PaymentFailed --> AwaitingPayment: Retry Payment
    PaymentFailed --> Cancelled: Max Attempts Reached
    
    Processing --> Shipped: Order Dispatched
    Processing --> Cancelled: Admin Cancels
    
    Shipped --> Delivered: Customer Receives
    Shipped --> Processing: Return to Processing
    
    Delivered --> [*]
    Cancelled --> [*]
    
    note right of AwaitingPayment
        Initial state when
        order is created
    end note
    
    note right of Processing
        Payment confirmed,
        preparing order
    end note
    
    note right of Shipped
        Order in transit
    end note
    
    note right of Delivered
        Order completed
    end note
```

## Product Search & Filter Flow

```mermaid
graph TD
    A[User Request] --> B{Search Type?}
    
    B -->|Text Search| C[Text Index Search]
    B -->|Category Filter| D[Category Filter]
    B -->|Price Range| E[Price Range Filter]
    B -->|Combined| F[Build Complex Query]
    
    C --> G[MongoDB Text Search]
    D --> H[Category Match]
    E --> I[Price Range Query]
    F --> J[Compound Query]
    
    G --> K[Apply Additional Filters]
    H --> K
    I --> K
    J --> K
    
    K --> L[Sort Results]
    L --> M[Paginate]
    M --> N[Return Results]
```

## Inventory Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant API
    participant ProductService
    participant StockHistoryService
    participant Database
    
    Admin->>API: Update Product Stock
    API->>ProductService: updateProduct(productId, data)
    
    ProductService->>Database: Get Current Product
    Database-->>ProductService: Current Stock: 100
    
    ProductService->>ProductService: Calculate Stock Change
    Note over ProductService: New Stock: 150<br/>Change: +50
    
    ProductService->>Database: Update Product Stock
    
    ProductService->>StockHistoryService: createStockEntry()
    StockHistoryService->>Database: Log Stock Change
    Note over Database: Type: restock<br/>Quantity: +50<br/>Previous: 100<br/>New: 150
    
    alt Stock Below Threshold
        ProductService->>ProductService: Check Low Stock
        ProductService->>Admin: Low Stock Alert
    end
    
    ProductService-->>API: Updated Product
    API-->>Admin: Success
```

## Discount Application Flow

```mermaid
graph TD
    A[User Applies Discount Code] --> B[Validate Discount Code]
    B --> C{Code Valid?}
    
    C -->|No| D[Return Error]
    C -->|Yes| E{Check Expiry}
    
    E -->|Expired| D
    E -->|Valid| F{Check Usage Limit}
    
    F -->|Exceeded| D
    F -->|Available| G{Check Minimum Order}
    
    G -->|Not Met| D
    G -->|Met| H[Calculate Discount]
    
    H --> I{Discount Type?}
    I -->|Percentage| J[Calculate % Off]
    I -->|Fixed| K[Subtract Fixed Amount]
    
    J --> L[Apply to Order]
    K --> L
    
    L --> M[Update Order Total]
    M --> N[Save Applied Discount]
    N --> O[Return Discounted Order]
```

## File Upload Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant FileMiddleware
    participant TempStorage
    participant Cloudinary
    participant Database
    
    User->>API: Upload Product Image
    API->>FileMiddleware: Process Upload
    FileMiddleware->>TempStorage: Save to /tmp/
    TempStorage-->>FileMiddleware: Temp File Path
    
    FileMiddleware->>API: File Available
    API->>Cloudinary: Upload Image
    Cloudinary->>Cloudinary: Process & Store
    Cloudinary-->>API: Image URL
    
    API->>Database: Save Image URL
    API->>TempStorage: Delete Temp File
    
    API-->>User: Success {imageUrl}
```

## Email Verification Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant TokenService
    participant EmailService
    participant Database
    
    User->>API: POST /v1/auth/send-verification-email
    API->>TokenService: generateVerifyEmailToken(userId)
    TokenService->>TokenService: Create JWT (10 min expiry)
    TokenService->>Database: Save Token
    
    TokenService-->>API: Verification Token
    API->>EmailService: sendVerificationEmail(user, token)
    EmailService->>EmailService: Build Email with Link
    EmailService->>User: Send Email
    
    User->>User: Click Verification Link
    User->>API: POST /v1/auth/verify-email?token=xxx
    API->>TokenService: verifyToken(token)
    
    alt Token Invalid/Expired
        TokenService-->>API: Invalid
        API-->>User: 401 Verification Failed
    end
    
    TokenService->>Database: Find Token
    Database-->>TokenService: Token Valid
    TokenService->>Database: Mark User as Verified
    TokenService->>Database: Delete Token
    
    TokenService-->>API: Success
    API-->>User: 204 Email Verified
```

## Role-Based Access Control Flow

```mermaid
graph TD
    A[Incoming Request] --> B[Extract JWT Token]
    B --> C[Verify Token Signature]
    C --> D{Valid Token?}
    
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F[Extract User from Token]
    
    F --> G[Get User Role]
    G --> H[Get Required Rights for Endpoint]
    
    H --> I{Check Permissions}
    I -->|Has Rights| J[Allow Access]
    I -->|No Rights| K[403 Forbidden]
    
    J --> L[Execute Controller]
    
    style E fill:#f88
    style K fill:#f88
    style J fill:#8f8
```

## Next Steps

- [User Flows](./04-user-flows.md) - Explore user journey scenarios
- [API Endpoints](./05-api-endpoints.md) - Complete endpoint reference
- [Authentication](./07-authentication.md) - Authentication deep dive
