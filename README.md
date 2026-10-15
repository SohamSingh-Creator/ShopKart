# 🛍️ ShopKart — Complete Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce application built with the **MERN** stack (MongoDB, Express, React, Node.js) covering **Engineering Labs 01 through 06**, featuring **JWT HttpOnly cookie authentication**, **Product discovery with search & filters**, **Persistent MongoDB Wishlist**, **Global state Shopping Cart**, and **Razorpay Test Mode Checkout & Orders** with **HMAC SHA-256 signature verification**.

---

## 🌟 Features by Lab Module

### 🛡️ Lab 01 — Customer Authentication Service (Backend)
- **MVC Architecture**: Segregated controllers, models, routes, middlewares, and utils.
- **Customer Registration** (`POST /customers/register`):
  - Strict validation: Full name, unique email, 10-digit phone, min 6-character password.
  - Automatic **bcrypt hashing** using Mongoose pre-save hooks. Passwords are never stored in plain text.
  - Password is never leaked in any response (`toJSON` sanitization).
  - Handles missing fields (`400`) and duplicate emails (`409 Conflict`).
- **Customer Login** (`POST /customers/login`):
  - Email-based lookup and bcrypt hash comparison.
  - Issues JWT and securely sets it in an **HttpOnly, Secure cookie**.
  - Returns generic `"Invalid credentials"` (`401`) on failure without leaking account existence.
- **Protected Profile** (`GET /customers/me`):
  - Auth middleware reads token from HttpOnly cookie or Authorization Bearer header.
  - Attaches customer to `req.user`.
- **Logout** (`POST /customers/logout`):
  - Clears authentication cookie.
- **⭐ Bonus Challenge**: Change Password API (`PATCH /customers/change-password`) with old password verification.

---

### 🎨 Lab 02 — Frontend Authentication Flow (React)
- **Vite + React Router DOM v6 + Tailwind CSS**.
- **Axios instance with `withCredentials: true`** to send cookies automatically on every request.
- **Pages**:
  - `/register`: Controlled inputs, validation error feedback, redirects to `/login` upon success.
  - `/login`: Clean sign-in form, invalid credentials error handling, navigates to `/home` or `/products`.
  - `/home`: Protected profile page fetching `/customers/me`, showing customer greeting, contact info, statistics, and quick dashboard navigation.
  - **Navbar**: Interactive navigation with brand logo, live badge counts, customer greeting, and reactive Logout button.

---

### 🔍 Lab 03 — Product Catalog & Discovery
- **Backend Product Model & APIs**:
  - `POST /products`: Validates name, description, price (> 0), category, image, stock (>= 0).
  - `GET /products`: Dynamic query engine supporting:
    - Case-insensitive regex name search (`?search=keyboard`).
    - Category filtering (`?category=Electronics`).
    - Combined search and category filtering.
    - **⭐ Bonus Challenge**: Sorting by price ascending (`?sort=price_asc`), descending (`?sort=price_desc`), and newest (`?sort=newest`).
  - `GET /products/:id`: Fetch single product by MongoDB ObjectId with 400/404 validation.
  - Automatic seed catalog of 10 items across Electronics, Fashion, Books, and Home.
- **Frontend Catalog Pages**:
  - `/products`: Live search bar, category dropdown, sort dropdown, responsive card grid.
  - `/products/:id`: High-res product view, in-depth description, stock indicator, quantity picker, wishlist toggle, and Add to Cart action.
  - Three distinct UI states: **Loading**, **Empty** ("No products found"), and **Error** ("Something went wrong").

---

### ❤️ Lab 04 — Persistent Wishlist
- **Database Relationship**:
  - References `Product` ObjectIds inside the `Customer` schema (`ref: "Product"`).
  - Preserves Product collection as single source of truth.
- **APIs**:
  - `POST /wishlist/:productId`: Protected, prevents duplicates (`409 Conflict`).
  - `GET /wishlist`: Populates product data (`name`, `price`, `category`, `image`, `stock`).
  - `DELETE /wishlist/:productId`: Removes product reference from user wishlist.
  - **⭐ Bonus Challenge**: Toggle endpoint (`PATCH /wishlist/:productId/toggle`).
- **Frontend**:
  - Product card wishlist toggle with states: default (♡), saving (⏳), and saved (♥).
  - Dedicated `/wishlist` page with Move to Cart and Remove actions.
  - Live Wishlist counter in Navbar.

---

### 🛒 Lab 05 — Shopping Cart & Global State
- **Data Model**:
  - Nested cart array in Customer: `{ product: ObjectId ref Product, quantity: Number }`.
- **APIs**:
  - `POST /cart/:productId`: Adds item with quantity 1, or increments existing quantity; enforces stock limits.
  - `GET /cart`: Returns populated cart items.
  - `PATCH /cart/:productId`: Updates quantity with stock boundary validation (`min: 1`, `max: stock`).
  - `DELETE /cart/:productId`: Removes item from cart.
- **Frontend Global State**:
  - Centralized `CartContext` using React Context API.
  - Derived values calculated in memory: **Subtotal** = `Σ(price × quantity)` and **Item Count** = `Σ(quantity)`.
  - Immediate optimistic UI feedback and navbar badge updates (`Cart (X)`).
  - `/cart` page with `[-] qty [+]` controls, itemized subtotals, and Order Summary.

---

### 💳 Lab 06 — Checkout, Razorpay Payment & Orders
- **Order Snapshot Architecture**:
  - `Order` schema captures historical purchase snapshots (`name`, `price`, `quantity`, `image`) so future catalog price changes do not alter historic orders.
- **Mandatory Razorpay Test Mode Payment**:
  - `POST /orders/create-payment-order`:
    - Validates shipping address (full name, phone, address, city, state, 6-digit pincode).
    - Re-validates current product stock & calculates total on the server (ignores any fake client totals).
    - Creates ShopKart order with status `PENDING_PAYMENT`.
    - Creates Razorpay order in paise (`amount × 100`) via Razorpay SDK.
    - Saves `razorpayOrderId`.
  - Standard Razorpay Checkout loaded dynamically via script loader in React.
  - `POST /orders/verify-payment`:
    - Re-generates and verifies cryptographic **HMAC SHA-256 signature** (`order.razorpayOrderId + "|" + payment_id`).
    - Marks order `PAID` and `PLACED`.
    - Deducts stock from inventory.
    - Clears user cart in database and in React global state.
  - `GET /orders` & `GET /orders/:id`:
    - User-specific order history (sorted newest first) with strict ownership enforcement (`order.user === req.user._id`).
  - `/order-success/:id`: Order confirmation screen.
  - `/orders/:id`: Full timeline tracker (`PLACED` → `CONFIRMED` → `SHIPPED` → `DELIVERED`).
  - **⭐ Bonus Challenge**: Dev/Admin status switcher (`PATCH /orders/:id/status`).

---

## 🏗️ Project Structure

```text
shopkart/
│
├── backend/
│   ├── config/
│   │   ├── db.js                   # MongoDB connection with MongoMemoryServer fallback
│   │   └── razorpay.js             # Razorpay Test Mode configuration
│   ├── controllers/
│   │   ├── customer.controller.js  # Auth, profile, logout, change password
│   │   ├── product.controller.js   # Product catalog, search, filter, sort
│   │   ├── wishlist.controller.js  # Wishlist CRUD & toggle
│   │   ├── cart.controller.js      # Cart CRUD, stock validation
│   │   └── order.controller.js     # Payment order, HMAC verify, order history
│   ├── models/
│   │   ├── customer.model.js       # Customer schema (bcrypt, wishlist, cart)
│   │   ├── product.model.js        # Product schema with search indexes
│   │   └── order.model.js          # Order schema with historical snapshots
│   ├── middlewares/
│   │   └── auth.middleware.js      # JWT cookie & Bearer token verification
│   ├── routes/
│   │   ├── customer.routes.js      # /customers endpoints
│   │   ├── product.routes.js       # /products endpoints
│   │   ├── wishlist.routes.js      # /wishlist endpoints
│   │   ├── cart.routes.js          # /cart endpoints
│   │   └── order.routes.js         # /orders endpoints
│   ├── utils/
│   │   ├── generateToken.js        # Sign JWT and set HttpOnly cookie
│   │   └── seedProducts.js         # Initial catalog seed data
│   ├── test_suite.js               # Comprehensive automated test runner
│   ├── index.js                    # Express app entrypoint & middlewares
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Reactive navigation with cart/wishlist counters
│   │   │   ├── ProductCard.jsx     # Card with stock, details, wishlist, cart
│   │   │   ├── WishlistCard.jsx    # Wishlist card with remove & move to cart
│   │   │   ├── CartItem.jsx        # Quantity controls [-] qty [+], item total
│   │   │   ├── CheckoutForm.jsx    # Shipping address inputs with validation
│   │   │   ├── OrderSummary.jsx    # Itemized summary and checkout button
│   │   │   ├── OrderCard.jsx       # Order history card with status badges
│   │   │   └── ProtectedRoute.jsx  # Client-side route guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state, login, register, logout
│   │   │   └── CartContext.jsx     # Global cart & wishlist state, derived subtotal
│   │   ├── pages/
│   │   │   ├── Register.jsx        # Customer registration
│   │   │   ├── Login.jsx           # Customer login
│   │   │   ├── Home.jsx            # Protected customer profile & dashboard
│   │   │   ├── Products.jsx        # Product discovery, search & filters
│   │   │   ├── ProductDetails.jsx  # Product detail view with actions
│   │   │   ├── Wishlist.jsx        # Wishlist listing page
│   │   │   ├── Cart.jsx            # Shopping cart page
│   │   │   ├── Checkout.jsx        # Razorpay checkout & payment verification
│   │   │   ├── OrderSuccess.jsx    # Order confirmed screen
│   │   │   ├── Orders.jsx          # Order history page
│   │   │   └── OrderDetails.jsx    # Order details & status progression tracker
│   │   ├── services/
│   │   │   └── api.js              # Centralized Axios client with withCredentials
│   │   ├── App.jsx                 # Routing configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or automatically uses built-in in-memory MongoDB)

### 1. Clone & Setup Backend

```bash
cd shopkart/backend
npm install
```

Configure `shopkart/backend/.env`:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/shopkart
JWT_SECRET=shopkart_super_secret_jwt_key_2026_very_secure
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=shopkart_razorpay_test_secret_key_12345
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```
*Note: The server will automatically connect to MongoDB (or launch an in-memory MongoDB server if local MongoDB is not running) and auto-seed 10 catalog products.*

### 2. Setup Frontend

In a separate terminal:
```bash
cd shopkart/frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Running Automated Tests

Run the built-in comprehensive test suite verifying all 6 labs:

```bash
cd shopkart/backend
node test_suite.js
```

All 35+ automated assertions will run and report:
```text
========================================================
🎉 ALL TESTS PASSED SUCCESSFULLY (100% SPEC COMPLIANCE)!
========================================================
```

---

## 🔌 API Endpoints Summary

### Authentication (`/customers`)
| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| POST | `/customers/register` | ❌ | Register new customer |
| POST | `/customers/login` | ❌ | Login & receive HttpOnly cookie |
| GET | `/customers/me` | ✅ | Get authenticated customer profile |
| POST | `/customers/logout` | ✅ | Clear auth cookie |
| PATCH | `/customers/change-password` | ✅ | Verify old password & set new password (Bonus) |

### Products (`/products`)
| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| POST | `/products` | ❌ | Create new product |
| GET | `/products` | ❌ | List products (supports `?search=`, `?category=`, `?sort=`) |
| GET | `/products/:id` | ❌ | Fetch single product by ID |

### Wishlist (`/wishlist`)
| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| POST | `/wishlist/:productId` | ✅ | Add product to wishlist (prevents duplicates) |
| GET | `/wishlist` | ✅ | Get populated wishlist |
| DELETE | `/wishlist/:productId` | ✅ | Remove product from wishlist |
| PATCH | `/wishlist/:productId/toggle` | ✅ | Toggle wishlist item (Bonus) |

### Shopping Cart (`/cart`)
| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| POST | `/cart/:productId` | ✅ | Add product to cart / increment quantity |
| GET | `/cart` | ✅ | Get populated cart items |
| PATCH | `/cart/:productId` | ✅ | Update quantity (validates stock) |
| DELETE | `/cart/:productId` | ✅ | Remove product from cart |

### Orders & Payments (`/orders`)
| Method | Endpoint | Auth | Purpose |
|---|---|:---:|---|
| POST | `/orders/create-payment-order` | ✅ | Validate address + stock, create ShopKart & Razorpay orders |
| POST | `/orders/verify-payment` | ✅ | Verify HMAC SHA-256 signature, mark PAID, deduct stock, clear cart |
| GET | `/orders` | ✅ | Fetch user's order history |
| GET | `/orders/:id` | ✅ | Fetch single order by ID (with ownership check) |
| PATCH | `/orders/:id/status` | ✅ | Progress order status (Bonus) |

---

## 🎤 TA Viva Reference Guide

1. **Why do we use bcrypt instead of encrypting passwords?**
   - Hashing is a one-way mathematical function; hashes cannot be reversed or decrypted back into plain text. Encryption is two-way and requires a key—if the key is compromised, all passwords are leaked. bcrypt also incorporates a salt and configurable work factor to protect against rainbow table attacks.
2. **Why is the HttpOnly flag important for cookies?**
   - Setting `httpOnly: true` prevents client-side JavaScript (`document.cookie`) from accessing the JWT. This protects the session from Cross-Site Scripting (XSS) token theft.
3. **Why do we use `withCredentials: true` in Axios?**
   - By default, browsers do not send cross-origin cookies. Setting `withCredentials: true` instructs the browser to include cookies with HTTP requests to the backend.
4. **Why are ObjectIds referenced (`ref: "Product"`) instead of embedding the whole product in Wishlist/Cart?**
   - Referencing ensures the `Product` collection remains the single source of truth. If a product's price, stock, or description changes, the wishlist and cart reflect the latest data dynamically via `populate()`.
5. **Why does an Order store a snapshot of product name and price?**
   - An Order represents a legally binding purchase record at a specific point in time. If a product's price increases from ₹2,999 to ₹3,499 next month, historical order records must continue showing ₹2,999.
6. **Why must the Razorpay order and total amount be created and calculated on the backend?**
   - Clients cannot be trusted. If the frontend calculated the price, an attacker could manipulate `totalAmount: 1`. The server owns the business and pricing rules, re-validates current product prices and stock, and creates the order in paise.
7. **What is the purpose of Razorpay HMAC SHA-256 signature verification?**
   - The signature is calculated as `HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, RAZORPAY_KEY_SECRET)`. Because only the backend and Razorpay have the Key Secret, verifying this signature mathematically guarantees the payment was authentically processed and not forged by a rogue client.
# ShopKart
