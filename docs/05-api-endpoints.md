# API Endpoints Reference

Base URL: `http://localhost:3000/v1`

All endpoints return JSON responses. Authentication is required for most endpoints using Bearer tokens.

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Stores](#stores)
- [Products](#products)
- [Orders](#orders)
- [Wishlist](#wishlist)
- [Payment](#payment)
- [Paystack](#paystack)
- [Discounts](#discounts)
- [Categories](#categories)
- [Stock History](#stock-history)
- [User Addresses](#user-addresses)
- [OTP Tokens](#otp-tokens)

---

## Authentication

### Register User
```http
POST /v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "isEmailVerified": false
  },
  "tokens": {
    "access": {
      "token": "eyJhbGc...",
      "expires": "2024-01-01T12:00:00.000Z"
    },
    "refresh": {
      "token": "eyJhbGc...",
      "expires": "2024-01-30T12:00:00.000Z"
    }
  }
}
```

### Login
```http
POST /v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK` (Same structure as register)

### Logout
```http
POST /v1/auth/logout
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `204 No Content`

### Refresh Tokens
```http
POST /v1/auth/refresh-tokens
```
**Headers:** `Authorization: Bearer {refresh_token}`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:** `200 OK`
```json
{
  "access": {
    "token": "eyJhbGc...",
    "expires": "2024-01-01T12:00:00.000Z"
  },
  "refresh": {
    "token": "eyJhbGc...",
    "expires": "2024-01-30T12:00:00.000Z"
  }
}
```

### Get Login Status
```http
GET /v1/auth/status
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Forgot Password
```http
POST /v1/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `204 No Content`

### Reset Password
```http
POST /v1/auth/reset-password?token={reset_token}
```

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Response:** `204 No Content`

### Send Verification Email
```http
POST /v1/auth/send-verification-email
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `204 No Content`

### Verify Email
```http
POST /v1/auth/verify-email?token={verify_token}
```

**Response:** `204 No Content`

---

## Users

### Create User (Admin Only)
```http
POST /v1/users
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "seller"
}
```

**Response:** `201 Created`

### Get All Users (Admin Only)
```http
GET /v1/users?page=1&limit=10&sortBy=createdAt:desc&name=John&role=buyer
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field and order (e.g., `name:asc`)
- `name` (optional): Filter by name
- `role` (optional): Filter by role

**Response:** `200 OK`
```json
{
  "results": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 50
}
```

### Get User
```http
GET /v1/users/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Update User
```http
PATCH /v1/users/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "phoneNumber": "+1234567890"
}
```

**Response:** `200 OK`

### Delete User
```http
DELETE /v1/users/:userId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin (or own account)

**Response:** `200 OK`

### Get User Role
```http
GET /v1/users/:userId/role
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`
```json
{
  "role": "buyer"
}
```

---

## Stores

### Create Store
```http
POST /v1/store/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "name": "My Awesome Store",
  "description": "Best products in town",
  "contactEmail": "store@example.com",
  "contactPhone": "+1234567890",
  "categories": ["Electronics", "Gadgets"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

**Response:** `201 Created`

### Get Store
```http
GET /v1/store/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`
```json
{
  "id": "store_id",
  "name": "My Awesome Store",
  "description": "Best products in town",
  "owner": "user_id",
  "logo": "https://cloudinary.com/...",
  "bannerImage": "https://cloudinary.com/...",
  "status": "active",
  "rating": 4.5,
  "totalRatings": 120,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Store
```http
PATCH /v1/store/:userId
```
**Headers:** `Authorization: Bearer {access_token}`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `name` (optional)
- `description` (optional)
- `logo` (optional): Image file
- `bannerImage` (optional): Image file
- `contactEmail` (optional)
- `contactPhone` (optional)

**Response:** `200 OK`

---

## Products

### Get All Products (Public)
```http
GET /v1/product/
```

**Response:** `200 OK` - Returns all products from all stores

### Get Filtered Products
```http
GET /v1/product/filter?category=electronics&minPrice=100&maxPrice=1000&tag=featured&page=1&limit=20
```

**Query Parameters:**
- `category` (optional): Category ID
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `tag` (optional): Product tag (latest, featured, sale, regular)
- `search` (optional): Text search
- `sortBy` (optional): Sort field (e.g., `price:asc`, `createdAt:desc`)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK`

### Get Product Details
```http
GET /v1/product/detail/:productId
```

**Response:** `200 OK`
```json
{
  "id": "product_id",
  "name": "Laptop Pro 15",
  "description": "High-performance laptop",
  "category": {
    "id": "category_id",
    "name": "Electronics"
  },
  "price": 1299.99,
  "compareAtPrice": 1499.99,
  "discount": {
    "type": "percentage",
    "value": 10,
    "active": true,
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "images": ["url1", "url2"],
  "inventory": {
    "quantity": 50,
    "sku": "LAP-PRO-15",
    "lowStockThreshold": 5,
    "sold": 120
  },
  "variants": [
    {
      "name": "Color",
      "options": ["Silver", "Space Gray"],
      "price": 1299.99,
      "quantity": 25,
      "sku": "LAP-PRO-15-SLV"
    }
  ],
  "specifications": [
    {
      "name": "RAM",
      "value": "16GB"
    }
  ],
  "status": "active",
  "rating": 4.7,
  "totalRatings": 89,
  "tag": "featured"
}
```

### Get Related Products
```http
GET /v1/product/related/:productId/:categoryId
```

**Response:** `200 OK` - Returns products in the same category

### Create Product (Seller)
```http
POST /v1/product/:userId
```
**Headers:** `Authorization: Bearer {access_token}`
**Content-Type:** `multipart/form-data`
**Required Role:** Seller/Admin

**Form Data:**
- `name`: Product name
- `description`: Product description
- `category`: Category ID
- `price`: Product price
- `compareAtPrice` (optional): Original price
- `tag` (optional): latest, featured, sale, regular
- `images`: Product images (multiple files)
- `inventory[quantity]`: Stock quantity
- `inventory[sku]`: SKU code
- `inventory[lowStockThreshold]` (optional): Low stock alert threshold
- `variants` (optional): JSON string of variants
- `specifications` (optional): JSON string of specifications

**Response:** `201 Created`

### Get All Products in User Store
```http
GET /v1/product/:userId?page=1&limit=10
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Get Single Product (Seller)
```http
GET /v1/product/:userId/:productId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Update Product
```http
PATCH /v1/product/:userId/:productId
```
**Headers:** `Authorization: Bearer {access_token}`
**Content-Type:** `multipart/form-data`

**Response:** `200 OK`

### Delete Product
```http
DELETE /v1/product/:userId/:productId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `204 No Content`

---

## Orders

### Create Order
```http
POST /v1/order
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "price": 1299.99,
      "variant": {
        "name": "Color",
        "option": "Silver"
      }
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "discountCode": "SAVE10"
}
```

**Response:** `201 Created`
```json
{
  "id": "order_id",
  "buyer": "user_id",
  "items": [...],
  "status": "awaiting_payment",
  "payment": {
    "status": "pending",
    "amount": 2599.98
  },
  "shippingAddress": {...},
  "subtotal": 2599.98,
  "discountedTotal": 2339.98,
  "total": 2339.98,
  "appliedDiscount": {
    "code": "SAVE10",
    "type": "percentage",
    "value": 10,
    "amount": 259.99
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Orders (Admin)
```http
GET /v1/order
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Get User Orders
```http
GET /v1/order/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Update Order
```http
PATCH /v1/order/:userId/:orderId
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "status": "processing"
}
```

**Response:** `200 OK`

### Delete Order
```http
DELETE /v1/order/:userId/:orderId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `204 No Content`

---

## Wishlist

### Add to Wishlist
```http
POST /v1/wishlist
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "productId": "product_id",
  "storeId": "store_id"
}
```

**Response:** `201 Created`

### Get Wishlists
```http
GET /v1/wishlist
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Get Wishlist by ID
```http
GET /v1/wishlist/:wishlistId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Remove from Wishlist
```http
DELETE /v1/wishlist/:productId/clear
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `204 No Content`

### Clear Wishlist
```http
DELETE /v1/wishlist/clear
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `204 No Content`

---

## Payment

### Get All Payments (Admin)
```http
GET /v1/payment
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

---

## Paystack

### Initialize Payment
```http
POST /v1/paystack/initialize/:orderId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "access_code",
    "reference": "reference_code"
  }
}
```

### Verify Payment
```http
GET /v1/paystack/verify?reference={reference}
```

**Response:** `200 OK`
```json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "status": "success",
    "reference": "reference_code",
    "amount": 259998,
    "metadata": {
      "orderId": "order_id"
    }
  }
}
```

---

## Discounts

### Create Discount (Admin)
```http
POST /v1/discount
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Request Body:**
```json
{
  "code": "SAVE10",
  "type": "percentage",
  "value": 10,
  "description": "10% off all products",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "usageLimit": 100,
  "minimumOrderAmount": 50,
  "applicableTo": "all"
}
```

**Response:** `201 Created`

### Get All Discounts (Admin)
```http
GET /v1/discount?page=1&limit=10&active=true
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Update Discount
```http
PATCH /v1/discount/:discountId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Delete Discount
```http
DELETE /v1/discount/:discountId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `204 No Content`

### Update Discount Status
```http
PATCH /v1/discount/:discountId/status
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Request Body:**
```json
{
  "active": false
}
```

**Response:** `200 OK`

### Apply Product Discount
```http
POST /v1/discount/product/:productId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Apply Variant Discount
```http
POST /v1/discount/product/:productId/variant/:variantId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Apply Category Discount
```http
POST /v1/discount/category/:category
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Validate Discount
```http
POST /v1/discount/validate
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "code": "SAVE10",
  "orderAmount": 100
}
```

**Response:** `200 OK`

### Get Discount by Code
```http
GET /v1/discount/code/:code
```

**Response:** `200 OK`

---

## Categories

### Get Categories (Public)
```http
GET /v1/categories?page=1&limit=10&sortBy=name:asc
```

**Response:** `200 OK`

### Get Featured Categories
```http
GET /v1/categories/featured
```

**Response:** `200 OK`

### Get Category by Slug
```http
GET /v1/categories/slug/:slug
```

**Response:** `200 OK`

### Get Category by ID
```http
GET /v1/categories/:categoryId
```

**Response:** `200 OK`

### Get Subcategories
```http
GET /v1/categories/:categoryId/subcategories
```

**Response:** `200 OK`

### Create Category (Admin)
```http
POST /v1/categories
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Request Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic products",
  "parentCategory": "parent_category_id",
  "featured": true
}
```

**Response:** `201 Created`

### Get All Categories (Admin)
```http
GET /v1/categories
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Update Category
```http
PATCH /v1/categories/:categoryId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Delete Category
```http
DELETE /v1/categories/:categoryId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `204 No Content`

---

## Stock History

### Create Stock Entry (Admin)
```http
POST /v1/stock-history
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Request Body:**
```json
{
  "product": "product_id",
  "type": "restock",
  "quantity": 50,
  "previousQuantity": 10,
  "newQuantity": 60,
  "reason": "New shipment received",
  "performedBy": "user_id"
}
```

**Response:** `201 Created`

### Get Stock History (Admin)
```http
GET /v1/stock-history?page=1&limit=10&type=restock
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

### Get Product Stock History
```http
GET /v1/stock-history/product/:productId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `200 OK`

---

## User Addresses

### Get User Addresses
```http
GET /v1/user-address/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Add Address
```http
POST /v1/user-address/:userId
```
**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "isDefault": true
}
```

**Response:** `201 Created`

### Update Address
```http
PATCH /v1/user-address/:userId/:addressId
```
**Headers:** `Authorization: Bearer {access_token}`

**Response:** `200 OK`

### Delete Address
```http
DELETE /v1/user-address/:userId/:addressId
```
**Headers:** `Authorization: Bearer {access_token}`
**Required Role:** Admin

**Response:** `204 No Content`

---

## OTP Tokens

OTP token endpoints are available at `/v1/otp-token` for managing one-time password tokens for additional security features.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Validation error: email must be a valid email"
}
```

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Please authenticate"
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "code": 500,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Authentication endpoints (`/v1/auth/*`) are rate-limited in production:
- **Limit:** 20 requests per 15 minutes per IP
- **Response when exceeded:** `429 Too Many Requests`

---

## Next Steps

- [Authentication](./07-authentication.md) - Authentication details
- [Data Models](./06-data-models.md) - Database schemas
- [Payment Integration](./08-payment-integration.md) - Payment processing
