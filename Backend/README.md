# PlantB E-commerce Backend REST API

PlantB is a production-ready, highly scalable, MVC-architected REST API backend designed for plant care e-commerce. It manages product collections (plants, pots, medicines, and accessories), user accounts with secure authentication flows, shopping carts, wishlists, checkouts, user profiles, default addresses, and administrative controls with comprehensive sales analytics and dashboards.

---

## 🛠 Tech Stack

*   **Runtime Environment**: Node.js (ES Modules syntax)
*   **Web Framework**: Express.js
*   **Database & ODM**: MongoDB with Mongoose
*   **Security & Auth**: JSON Web Tokens (Access + Refresh tokens) & BcryptJS for password hashing
*   **Image Uploads**: Multer (Local storage config with type validation)
*   **Body Validation**: Express-Validator

---

## 📂 MVC Directory Structure

```text
PlantB/
├── src/
│   ├── config/              # DB & Multer config
│   │   ├── db.js
│   │   └── multer.js
│   ├── controllers/         # MVC Controller handlers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── profileController.js
│   │   └── wishlistController.js
│   ├── middleware/          # Protection, validation, and error middlewares
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validatorMiddleware.js
│   ├── models/              # Mongoose DB Schemas
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── RefreshToken.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/              # Express endpoint routers
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── profileRoutes.js
│   │   └── wishlistRoutes.js
│   ├── utils/               # Tokens, seeding, validation rules, and integration tests
│   │   ├── seed.js
│   │   ├── test.js
│   │   ├── token.js
│   │   └── validationRules.js
│   ├── app.js               # App configuration & middleware binding
│   └── server.js            # Server entry point
├── uploads/                 # Statically served product images
├── .env                     # Configuration variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Configuration (`.env`)
Ensure your environment variables are configured in the `.env` file at the root of the project:
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/plantb
JWT_SECRET=plantb_access_token_secret_key_987654321
JWT_REFRESH_SECRET=plantb_refresh_token_secret_key_123456789
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Database Seeding
To clear old entries and seed the database with mock categories, users, products, wishlists, reviews, and historical orders:
```bash
npm run seed
```

### 4. Running the Server
To run in standard mode:
```bash
npm start
```

To run in development mode with live reload:
```bash
npm run dev
```

### 5. Running Integration Tests
With the server running at `http://127.0.0.1:5000`, execute the automated integration test suite:
```bash
npm run test
```

---

## 📝 API Endpoints & Reference

### 🔐 Authentication

#### Register a New User
*   **Endpoint**: `POST /api/auth/register`
*   **Body (JSON)**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "password123"
    }
    ```
*   **Response**: `201 Created`

#### Login
*   **Endpoint**: `POST /api/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "jane@example.com",
      "password": "password123"
    }
    ```
*   **Response**: `200 OK` (returns short-lived `accessToken` and long-lived `refreshToken`)

#### Refresh Token
*   **Endpoint**: `POST /api/auth/refresh`
*   **Body (JSON)**:
    ```json
    {
      "refreshToken": "your-refresh-token-here"
    }
    ```
*   **Response**: `200 OK` (returns a fresh `accessToken`)

#### Logout
*   **Endpoint**: `POST /api/auth/logout`
*   **Body (JSON)**:
    ```json
    {
      "refreshToken": "your-refresh-token-here"
    }
    ```
*   **Response**: `200 OK`

---

### 🌿 Public Catalog Endpoints

#### List Categories
*   **Endpoint**: `GET /api/categories`

#### List Products (with Search, Pagination, Sort, Filter)
*   **Endpoint**: `GET /api/products`
*   **Query Parameters**:
    *   `page`: (default: `1`)
    *   `limit`: (default: `10`)
    *   `category`: Category ID or Name
    *   `type`: Product subcategory type (e.g. `indoor`)
    *   `minPrice`, `maxPrice`: Price range filter
    *   `rating`: Minimum average rating filter
    *   `sortBy`: `price:asc`, `price:desc`, `rating:desc`, or `createdAt:desc` (default)
*   **Response**: Paginated JSON list of products

#### Search Products (Full-Text Search)
*   **Endpoint**: `GET /api/products/search`
*   **Query Parameters**: `q=Monstera`

#### Get Single Product Details
*   **Endpoint**: `GET /api/products/:id`

#### Get Featured Products
*   **Endpoint**: `GET /api/products/featured`

#### Submit Product Review (Requires Authentication)
*   **Endpoint**: `POST /api/products/:id/reviews`
*   **Body (JSON)**:
    ```json
    {
      "rating": 5,
      "comment": "Healthy leaves and rapid growth!"
    }
    ```

---

### 🛍 Customer Shopping Features (Requires JWT Header: `Authorization: Bearer <token>`)

#### View Shopping Cart
*   **Endpoint**: `GET /api/cart`

#### Add/Update Items in Cart
*   **Endpoint**: `POST /api/cart`
*   **Body (JSON)**:
    ```json
    {
      "productId": "product-mongodb-id",
      "quantity": 2
    }
    ```

#### Update Item Quantity in Cart
*   **Endpoint**: `PUT /api/cart/:itemId`
*   **Body (JSON)**: `{"quantity": 5}`

#### Remove Item from Cart
*   **Endpoint**: `DELETE /api/cart/:itemId`

#### Add/Remove Wishlist Products
*   **Endpoint**: `POST /api/wishlist/:productId` (Toggles status)

#### Get Wishlist Details
*   **Endpoint**: `GET /api/wishlist`

---

### 📦 Customer Order Operations (Requires Authentication)

#### Place Order (Checkout)
*   **Endpoint**: `POST /api/orders`
*   **Body (JSON)**:
    ```json
    {
      "items": [
        { "product": "product-id", "quantity": 1 }
      ],
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Green City",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
      },
      "paymentMethod": "cod"
    }
    ```

#### View Order History
*   **Endpoint**: `GET /api/orders/my-orders`

#### Cancel Order
*   **Endpoint**: `POST /api/orders/:id/cancel`
    *   *Note*: Orders can only be cancelled while status is `pending` or `confirmed`.

---

### 👤 Profile Management (Requires Authentication)

#### View Profile
*   **Endpoint**: `GET /api/profile`

#### Update Personal Info
*   **Endpoint**: `PUT /api/profile`
*   **Body (JSON)**: `{"name": "Jane Doe"}`

#### Change Password
*   **Endpoint**: `PUT /api/profile/change-password`
*   **Body (JSON)**:
    ```json
    {
      "oldPassword": "password123",
      "newPassword": "securepassword456"
    }
    ```

#### Add Shipping Address
*   **Endpoint**: `POST /api/profile/address`
*   **Body (JSON)**:
    ```json
    {
      "street": "100 Maple St",
      "city": "Plainsboro",
      "state": "NJ",
      "zipCode": "08536",
      "country": "USA",
      "isDefault": true
    }
    ```

---

### 👑 Admin Management (Requires Admin Authentication)

#### Add a Product (Multer Multi-part Form Upload)
*   **Endpoint**: `POST /api/admin/products`
*   **Form Data Fields**:
    *   `name`, `description`, `price`, `stock`, `category`, `type`, `tags`
    *   `images`: file upload fields (up to 5 images)

#### Delete a Product
*   **Endpoint**: `DELETE /api/admin/products/:id`

#### Update Product Stock
*   **Endpoint**: `PUT /api/admin/products/:id/stock`
*   **Body (JSON)**: `{"stock": 100}`

#### Add a Category
*   **Endpoint**: `POST /api/admin/categories`

#### Update Order Status
*   **Endpoint**: `PUT /api/admin/orders/:id/status`
*   **Body (JSON)**: `{"status": "shipped"}` (valid enums: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`)

#### Block or Unblock a User
*   **Endpoint**: `PUT /api/admin/users/:id/block`
*   **Body (JSON)**: `{"isBlocked": true}`

#### Business Intelligence Dashboard Overview
*   **Endpoint**: `GET /api/admin/dashboard`
*   **Metrics Returned**: Total sales revenue, order counts, customer counts, low stock product alerts, and low stock list.

#### Top Selling Products Analytics
*   **Endpoint**: `GET /api/admin/analytics/top-products`
*   **Metrics**: List of 10 best-selling items, units sold, and cumulative sales revenue.

#### Sales Revenue Reports
*   **Endpoint**: `GET /api/admin/analytics/revenue`
*   **Query Parameters**: `period` (values: `daily`, `weekly`, `monthly`)
