# Inventory Transaction API

A backend service built with Node.js, Express.js, and MongoDB for managing products, stock levels, and transaction history.

## 🚀 Features

-   ✅ Create products with unique SKU
-   ✅ Increase/Decrease stock with transaction logging
-   ✅ View product summary with stock analytics
-   ✅ View complete transaction history
-   ✅ Prevent negative stock levels
-   ✅ RESTful API design
-   ✅ Error handling and validation

## 📋 Tech Stack

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB
-   **ODM:** Mongoose
-   **Environment:** dotenv
-   **CORS:** Enabled

## 📁 Project Structure

```
Inventory Transaction API/
├── app.js                      # Express app configuration
├── index.js                    # Server entry point
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables
├── .env.example                # Environment template
├── controllers/
│   └── product.controller.js   # Business logic
├── db/
│   └── index.js                # Database connection
├── middlewares/
│   └── error.middleware.js     # Error handling
├── models/
│   ├── product.model.js        # Product schema
│   └── transaction.model.js    # Transaction schema
├── routes/
│   └── product.routes.js       # API routes
└── utils/
    ├── ApiError.js             # Custom error class
    ├── ApiResponse.js          # Response formatter
    └── asyncHandler.js         # Async wrapper
```

## 🛠️ Installation

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (running locally or remote)
-   npm or yarn

### Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Inventory Transaction API"
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=inventory_db
NODE_ENV=development
CORS_ORIGIN=*
```

4. **Start MongoDB**

```bash
# If using local MongoDB
mongod
```

5. **Run the application**

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 📡 API Endpoints

### Base URL

```
http://localhost:3000
```

### 1. Health Check

**GET** `/health`

```bash
curl -X GET http://localhost:3000/health
```

**Response:**

```json
{
    "success": true,
    "message": "Server is running"
}
```

---

### 2. Create Product

**POST** `/products`

**Request Body:**

```json
{
    "name": "Laptop",
    "sku": "LP101",
    "initialStock": 20
}
```

**cURL Command:**

```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LP101",
    "initialStock": 20
  }'
```

**Response:**

```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "_id": "657abc123def456789012345",
        "name": "Laptop",
        "sku": "LP101",
        "currentStock": 20,
        "totalIncreased": 0,
        "totalDecreased": 0,
        "createdAt": "2025-12-10T10:30:00.000Z",
        "updatedAt": "2025-12-10T10:30:00.000Z"
    }
}
```

**Validation Rules:**

-   `name`: Required, non-empty string
-   `sku`: Required, unique, converted to uppercase
-   `initialStock`: Required, must be ≥ 0

---

### 3. Increase Stock

**POST** `/products/:id/increase`

**Request Body:**

```json
{
    "quantity": 5
}
```

**cURL Command:**

```bash
curl -X POST http://localhost:3000/products/657abc123def456789012345/increase \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

**Response:**

```json
{
    "success": true,
    "message": "Stock increased successfully",
    "data": {
        "product": {
            "_id": "657abc123def456789012345",
            "name": "Laptop",
            "sku": "LP101",
            "currentStock": 25,
            "totalIncreased": 5,
            "totalDecreased": 0
        },
        "transaction": {
            "_id": "657def123abc456789012346",
            "productId": "657abc123def456789012345",
            "type": "INCREASE",
            "quantity": 5,
            "timestamp": "2025-12-10T10:35:00.000Z"
        }
    }
}
```

**Validation Rules:**

-   `quantity`: Required, must be > 0

---

### 4. Decrease Stock

**POST** `/products/:id/decrease`

**Request Body:**

```json
{
    "quantity": 3
}
```

**cURL Command:**

```bash
curl -X POST http://localhost:3000/products/657abc123def456789012345/decrease \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

**Response:**

```json
{
    "success": true,
    "message": "Stock decreased successfully",
    "data": {
        "product": {
            "_id": "657abc123def456789012345",
            "name": "Laptop",
            "sku": "LP101",
            "currentStock": 22,
            "totalIncreased": 5,
            "totalDecreased": 3
        },
        "transaction": {
            "_id": "657ghi123jkl456789012347",
            "productId": "657abc123def456789012345",
            "type": "DECREASE",
            "quantity": 3,
            "timestamp": "2025-12-10T10:40:00.000Z"
        }
    }
}
```

**Validation Rules:**

-   `quantity`: Required, must be > 0
-   Cannot decrease stock below 0

---

### 5. View Product Summary

**GET** `/products/:id`

**cURL Command:**

```bash
curl -X GET http://localhost:3000/products/657abc123def456789012345
```

**Response:**

```json
{
    "success": true,
    "message": "Product retrieved successfully",
    "data": {
        "_id": "657abc123def456789012345",
        "name": "Laptop",
        "sku": "LP101",
        "currentStock": 22,
        "totalIncreased": 5,
        "totalDecreased": 3,
        "createdAt": "2025-12-10T10:30:00.000Z",
        "updatedAt": "2025-12-10T10:40:00.000Z"
    }
}
```

---

### 6. View Transaction History

**GET** `/products/:id/transactions`

**cURL Command:**

```bash
curl -X GET http://localhost:3000/products/657abc123def456789012345/transactions
```

**Response:**

```json
{
    "success": true,
    "message": "Transactions retrieved successfully",
    "data": [
        {
            "_id": "657def123abc456789012346",
            "productId": "657abc123def456789012345",
            "type": "INCREASE",
            "quantity": 5,
            "timestamp": "2025-12-10T10:35:00.000Z"
        },
        {
            "_id": "657ghi123jkl456789012347",
            "productId": "657abc123def456789012345",
            "type": "DECREASE",
            "quantity": 3,
            "timestamp": "2025-12-10T10:40:00.000Z"
        }
    ]
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**1. Duplicate SKU (409 Conflict)**

```json
{
    "success": false,
    "message": "Product with SKU LP101 already exists",
    "statusCode": 409
}
```

**2. Insufficient Stock (400 Bad Request)**

```json
{
    "success": false,
    "message": "Insufficient stock. Available: 22, Requested: 1000",
    "statusCode": 400
}
```

**3. Invalid Product ID (404 Not Found)**

```json
{
    "success": false,
    "message": "Product not found",
    "statusCode": 404
}
```

**4. Validation Error (400 Bad Request)**

```json
{
    "success": false,
    "message": "Quantity must be greater than 0",
    "statusCode": 400
}
```

**5. Route Not Found (404)**

```json
{
    "success": false,
    "message": "Route not found"
}
```

---

## 📊 Database Schema

### Product Model

```javascript
{
  name: String (required, trimmed),
  sku: String (required, unique, uppercase),
  currentStock: Number (default: 0, min: 0),
  totalIncreased: Number (default: 0),
  totalDecreased: Number (default: 0),
  timestamps: true
}
```

### Transaction Model

```javascript
{
  productId: ObjectId (ref: Product, required),
  type: String (enum: ["INCREASE", "DECREASE"], required),
  quantity: Number (required, min: 1),
  timestamp: Date (default: Date.now)
}
```

---

## 🔧 Environment Variables

| Variable        | Description            | Default                   |
| --------------- | ---------------------- | ------------------------- |
| `PORT`          | Server port            | 3000                      |
| `MONGO_URI`     | MongoDB connection URI | mongodb://localhost:27017 |
| `MONGO_DB_NAME` | Database name          | inventory_db              |
| `NODE_ENV`      | Environment mode       | development               |
| `CORS_ORIGIN`   | Allowed CORS origins   | \*                        |

---

## 📝 Example Usage Scenarios

### Scenario 1: Basic Product Management

```bash
# 1. Create a product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Keyboard", "sku": "KB303", "initialStock": 30}'

# 2. Get product ID from response, then increase stock
curl -X POST http://localhost:3000/products/<PRODUCT_ID>/increase \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}'

# 3. Check updated summary
curl -X GET http://localhost:3000/products/<PRODUCT_ID>
```

### Scenario 2: Multiple Products

```bash
# Create multiple products
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Monitor", "sku": "MN404", "initialStock": 15}'

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Headphones", "sku": "HP505", "initialStock": 40}'
```

### Scenario 3: Stock Management

```bash
# Increase stock multiple times
curl -X POST http://localhost:3000/products/<PRODUCT_ID>/increase \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'

curl -X POST http://localhost:3000/products/<PRODUCT_ID>/increase \
  -H "Content-Type: application/json" \
  -d '{"quantity": 10}'

# Decrease stock
curl -X POST http://localhost:3000/products/<PRODUCT_ID>/decrease \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'

# View complete history
curl -X GET http://localhost:3000/products/<PRODUCT_ID>/transactions
```
