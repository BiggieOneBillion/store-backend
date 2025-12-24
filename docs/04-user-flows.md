# User Flows & Journey Maps

## User Roles

The system supports three primary user roles:

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| **Buyer** | Regular customers | Browse products, make purchases, manage wishlist, track orders |
| **Seller** | Store owners | Manage store, products, inventory, view orders |
| **Admin** | System administrators | Full system access, user management, platform oversight |

## Buyer Journey Flows

### 1. New Buyer Registration & First Purchase

```mermaid
journey
    title New Buyer Journey - First Purchase
    section Registration
      Visit Platform: 5: Buyer
      Create Account: 4: Buyer
      Verify Email: 3: Buyer
    section Discovery
      Browse Products: 5: Buyer
      Search by Category: 5: Buyer
      View Product Details: 5: Buyer
      Add to Wishlist: 4: Buyer
    section Purchase
      Add to Cart: 5: Buyer
      Enter Shipping Address: 4: Buyer
      Apply Discount Code: 5: Buyer
      Review Order: 4: Buyer
      Proceed to Payment: 4: Buyer
      Complete Payment: 3: Buyer
    section Post-Purchase
      Receive Confirmation: 5: Buyer
      Track Order: 4: Buyer
      Receive Product: 5: Buyer
      Leave Review: 4: Buyer
```

### 2. Product Discovery Flow

```mermaid
graph TD
    A[Buyer Visits Platform] --> B{How to Find Product?}
    
    B -->|Browse| C[View All Products]
    B -->|Search| D[Text Search]
    B -->|Category| E[Browse by Category]
    
    C --> F[Apply Filters]
    D --> F
    E --> F
    
    F --> G{Filter Options}
    G -->|Price Range| H[Filter by Price]
    G -->|Category| I[Filter by Category]
    G -->|Tag| J[Filter by Tag]
    G -->|Rating| K[Filter by Rating]
    
    H --> L[View Results]
    I --> L
    J --> L
    K --> L
    
    L --> M[Click Product]
    M --> N[View Product Details]
    
    N --> O{Action?}
    O -->|Like| P[Add to Wishlist]
    O -->|Buy| Q[Add to Cart]
    O -->|Compare| R[View Related Products]
    
    P --> S[Continue Shopping]
    Q --> T[Proceed to Checkout]
    R --> N
```

### 3. Checkout & Payment Flow

```mermaid
graph TD
    A[Cart Review] --> B[Select Shipping Address]
    B --> C{Has Saved Address?}
    
    C -->|Yes| D[Select from Saved]
    C -->|No| E[Enter New Address]
    
    D --> F[Review Order Summary]
    E --> F[Save Address Option]
    F --> F
    
    F --> G{Have Discount Code?}
    G -->|Yes| H[Apply Discount]
    G -->|No| I[View Total]
    
    H --> J{Code Valid?}
    J -->|Yes| K[Discount Applied]
    J -->|No| L[Show Error]
    L --> G
    
    K --> I
    I --> M[Confirm Order]
    M --> N[Create Order]
    N --> O[Redirect to Paystack]
    
    O --> P[Enter Payment Details]
    P --> Q[Process Payment]
    
    Q --> R{Payment Success?}
    R -->|Yes| S[Order Confirmed]
    R -->|No| T[Payment Failed]
    
    S --> U[Email Confirmation]
    S --> V[Order Tracking Page]
    
    T --> W[Retry Payment Option]
    W --> O
```

### 4. Order Tracking Flow

```mermaid
stateDiagram-v2
    [*] --> ViewOrders: Access Order History
    
    ViewOrders --> SelectOrder: Click Order
    SelectOrder --> OrderDetails: View Details
    
    OrderDetails --> CheckStatus: View Status
    
    state CheckStatus {
        [*] --> AwaitingPayment
        AwaitingPayment --> Processing: Payment Confirmed
        Processing --> Shipped: Dispatched
        Shipped --> Delivered: Received
        
        AwaitingPayment --> Cancelled: Payment Failed/Cancelled
        Processing --> Cancelled: Admin Cancelled
    }
    
    OrderDetails --> ContactSupport: Issue with Order
    OrderDetails --> RetryPayment: Payment Failed
    OrderDetails --> ViewOrders: Back to Orders
    
    Delivered --> LeaveReview: Review Product
    LeaveReview --> [*]
```

## Seller Journey Flows

### 1. Seller Onboarding

```mermaid
journey
    title Seller Onboarding Journey
    section Registration
      Sign Up as Seller: 4: Seller
      Verify Email: 3: Seller
      Login to Dashboard: 5: Seller
    section Store Setup
      Create Store: 5: Seller
      Add Store Details: 4: Seller
      Upload Logo & Banner: 4: Seller
      Set Store Categories: 4: Seller
    section Product Listing
      Add First Product: 5: Seller
      Upload Product Images: 4: Seller
      Set Pricing & Inventory: 4: Seller
      Add Product Variants: 3: Seller
      Publish Product: 5: Seller
    section Launch
      Review Store: 4: Seller
      Activate Store: 5: Seller
      Share Store Link: 5: Seller
```

### 2. Product Management Flow

```mermaid
graph TD
    A[Seller Dashboard] --> B{Product Action?}
    
    B -->|Create| C[New Product Form]
    B -->|Edit| D[Select Product]
    B -->|Delete| E[Confirm Delete]
    B -->|View| F[Product List]
    
    C --> G[Enter Product Details]
    G --> H[Upload Images]
    H --> I[Set Pricing]
    I --> J[Configure Inventory]
    J --> K{Add Variants?}
    
    K -->|Yes| L[Add Variant Options]
    K -->|No| M[Set Specifications]
    
    L --> M
    M --> N{Apply Discount?}
    
    N -->|Yes| O[Configure Discount]
    N -->|No| P[Review Product]
    
    O --> P
    P --> Q[Save Product]
    Q --> R[Product Published]
    
    D --> G
    E --> S[Product Deleted]
    F --> T[View Analytics]
```

### 3. Inventory Management Flow

```mermaid
graph TD
    A[Inventory Dashboard] --> B{Action Type?}
    
    B -->|Restock| C[Select Product]
    B -->|Adjust| D[Stock Adjustment]
    B -->|View History| E[Stock History]
    B -->|Low Stock Alert| F[View Low Stock Items]
    
    C --> G[Enter Restock Quantity]
    G --> H[Add Restock Note]
    H --> I[Confirm Restock]
    I --> J[Update Inventory]
    J --> K[Log Stock History]
    
    D --> L[Enter Adjustment]
    L --> M[Select Reason]
    M --> J
    
    F --> N{Action?}
    N -->|Restock| C
    N -->|Deactivate| O[Mark Out of Stock]
    
    E --> P[Filter by Product]
    P --> Q[View Changes Over Time]
```

### 4. Order Fulfillment Flow

```mermaid
sequenceDiagram
    participant Buyer
    participant System
    participant Seller
    participant Shipping
    
    Buyer->>System: Place Order
    System->>Seller: New Order Notification
    
    Seller->>System: View Order Details
    Seller->>System: Confirm Order (Processing)
    System->>Buyer: Order Confirmed Email
    
    Seller->>Seller: Prepare Package
    Seller->>System: Mark as Shipped
    Seller->>System: Add Tracking Number
    
    System->>Buyer: Shipment Notification
    System->>Shipping: Update Tracking
    
    Shipping->>System: Delivery Updates
    System->>Buyer: Delivery Status Updates
    
    Shipping->>Buyer: Deliver Package
    Buyer->>System: Confirm Delivery
    System->>Seller: Order Completed
    
    Buyer->>System: Leave Review
    System->>Seller: New Review Notification
```

## Admin Journey Flows

### 1. Platform Management Flow

```mermaid
graph TD
    A[Admin Dashboard] --> B{Management Area?}
    
    B -->|Users| C[User Management]
    B -->|Stores| D[Store Management]
    B -->|Products| E[Product Oversight]
    B -->|Orders| F[Order Management]
    B -->|Analytics| G[Platform Analytics]
    
    C --> C1[View All Users]
    C1 --> C2{Action?}
    C2 -->|Edit| C3[Update User]
    C2 -->|Delete| C4[Remove User]
    C2 -->|Change Role| C5[Assign Role]
    
    D --> D1[View All Stores]
    D1 --> D2{Action?}
    D2 -->|Activate| D3[Activate Store]
    D2 -->|Suspend| D4[Suspend Store]
    D2 -->|Delete| D5[Remove Store]
    
    E --> E1[View All Products]
    E1 --> E2{Action?}
    E2 -->|Approve| E3[Approve Product]
    E2 -->|Flag| E4[Flag Product]
    E2 -->|Remove| E5[Delete Product]
    
    F --> F1[View All Orders]
    F1 --> F2{Action?}
    F2 -->|View| F3[Order Details]
    F2 -->|Cancel| F4[Cancel Order]
    F2 -->|Refund| F5[Process Refund]
    
    G --> G1[Sales Analytics]
    G --> G2[User Growth]
    G --> G3[Revenue Reports]
    G --> G4[Top Products]
```

### 2. Discount Management Flow

```mermaid
graph TD
    A[Discount Management] --> B{Discount Type?}
    
    B -->|Product| C[Product Discount]
    B -->|Category| D[Category Discount]
    B -->|Coupon Code| E[Coupon Creation]
    
    C --> F[Select Products]
    D --> G[Select Categories]
    E --> H[Generate Code]
    
    F --> I[Set Discount Value]
    G --> I
    H --> I
    
    I --> J{Discount Type?}
    J -->|Percentage| K[Set Percentage]
    J -->|Fixed Amount| L[Set Amount]
    
    K --> M[Set Date Range]
    L --> M
    
    M --> N[Set Usage Limits]
    N --> O[Set Minimum Order]
    O --> P[Review Discount]
    P --> Q[Activate Discount]
    
    Q --> R[Monitor Usage]
    R --> S{Action?}
    S -->|Edit| I
    S -->|Deactivate| T[Disable Discount]
    S -->|Delete| U[Remove Discount]
```

## Common User Scenarios

### Scenario 1: Buyer Finds and Purchases Product

```mermaid
graph LR
    A[Search for 'laptop'] --> B[View Results]
    B --> C[Filter: $500-$1000]
    C --> D[Sort: Highest Rated]
    D --> E[Click Product]
    E --> F[View Details & Reviews]
    F --> G[Add to Cart]
    G --> H[Apply Coupon: SAVE10]
    H --> I[Checkout]
    I --> J[Pay with Paystack]
    J --> K[Order Confirmed]
```

### Scenario 2: Seller Manages Low Stock

```mermaid
graph LR
    A[Receive Low Stock Alert] --> B[View Inventory]
    B --> C[Check Stock Levels]
    C --> D[Restock Product]
    D --> E[Update Quantity: +50]
    E --> F[Log Restock]
    F --> G[Alert Cleared]
```

### Scenario 3: Admin Handles Dispute

```mermaid
graph LR
    A[Buyer Reports Issue] --> B[Admin Reviews Order]
    B --> C[Contact Seller]
    C --> D[Investigate]
    D --> E{Resolution?}
    E -->|Refund| F[Process Refund]
    E -->|Replace| G[Arrange Replacement]
    E -->|Reject| H[Inform Buyer]
    F --> I[Close Ticket]
    G --> I
    H --> I
```

## Mobile vs Web User Experience

### Key Differences

| Feature | Web Experience | Mobile Experience |
|---------|---------------|-------------------|
| **Navigation** | Full menu, sidebar | Hamburger menu, bottom nav |
| **Product View** | Grid layout, multiple columns | Single column, swipeable images |
| **Checkout** | Multi-step form | Progressive disclosure |
| **Payment** | Desktop Paystack flow | Mobile-optimized Paystack |
| **Notifications** | Email + in-app | Push notifications + email |

## User Pain Points & Solutions

| Pain Point | Solution Implemented |
|-----------|---------------------|
| Forgotten passwords | Password reset via email |
| Lost orders | Order tracking with email updates |
| Complex checkout | Saved addresses, one-click reorder |
| Unclear pricing | Transparent pricing with discount display |
| Payment failures | Retry mechanism with clear error messages |
| Stock unavailability | Real-time inventory updates |
| Slow search | Text indexing for fast search |
| Spam emails | Email verification, opt-in preferences |

## Next Steps

- [API Endpoints](./05-api-endpoints.md) - Complete API reference
- [Data Models](./06-data-models.md) - Database schemas
- [System Flow](./03-system-flow.md) - Technical flow diagrams
