# API Usage Guide

This guide provides practical examples and workflows for interacting with the Multi-Store E-Commerce API.

## Authentication Workflow

All protected endpoints require a JWT access token in the `Authorization` header.

### 1. Register a New User
**Endpoint**: `POST /v1/auth/register`

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### 2. Login
**Endpoint**: `POST /v1/auth/login`

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```
**Response**:
```json
{
  "user": { ... },
  "tokens": {
    "access": { "token": "...", "expires": "..." },
    "refresh": { "token": "...", "expires": "..." }
  }
}
```

### 3. Use Access Token
Include the token in all subsequent requests:
```bash
curl -H "Authorization: Bearer <access_token>" http://localhost:3000/v1/users/me
```

---

## Seller Workflow: Managing a Store

### 1. Create a Store
**Endpoint**: `POST /v1/store`

```bash
curl -X POST http://localhost:3000/v1/store \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome Electronics",
    "description": "The best gadgets in town"
  }'
```

### 2. Add a Product
**Endpoint**: `POST /v1/product`

```bash
curl -X POST http://localhost:3000/v1/product \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone X",
    "description": "High-end flagship device",
    "price": 999,
    "stock": 50,
    "store": "<store_id>",
    "category": "<category_id>"
  }'
```

---

## Buyer Workflow: Shopping & Payments

### 1. Search Products
**Endpoint**: `GET /v1/product?name=Smartphone`

```bash
curl http://localhost:3000/v1/product?name=Smartphone
```

### 2. Initialize Payment (Paystack)
**Endpoint**: `POST /v1/paystack/initialize`

```bash
curl -X POST http://localhost:3000/v1/paystack/initialize \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "<order_id>",
    "email": "user@example.com",
    "amount": 99900
  }'
```
*Note: Amount is in kobo (multiply by 100).*

### 3. Verify Payment
After the user completes payment on the Paystack UI, verify the transaction:
**Endpoint**: `GET /v1/paystack/verify?reference=<reference>`

---

## Common Query Parameters

Many lists support pagination and sorting:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by (e.g., `price:desc`, `createdAt:asc`)

Example:
```bash
curl http://localhost:3000/v1/product?limit=20&page=2&sortBy=price:desc
```

## Error Handling

The API returns standard HTTP status codes:
- `200/201`: Success
- `400`: Bad Request (Validation failed)
- `401`: Unauthorized (Missing/invalid token)
- `403`: Forbidden (Insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this structure:
```json
{
  "code": 400,
  "message": "\"price\" must be a number"
}
```
