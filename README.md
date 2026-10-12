# 🛒 ShopKart - Full-Stack E-Commerce Platform

ShopKart is a modern, full-stack e-commerce web application featuring user authentication, product catalog browsing, wishlist management, cart operations, order processing, and payment integration.

---

## 🚀 Features

- **User Authentication**: Secure user registration and login with JWT and password hashing (bcrypt).
- **Product Catalog**: Browse and explore products by category with real-time stock and pricing.
- **Product Details**: Comprehensive product view with images, ratings, descriptions, and stock status.
- **Wishlist**: Save favorite items for later viewing and quick access.
- **Shopping Cart**: Add, remove, and adjust item quantities with instant subtotal and tax calculation.
- **Checkout & Orders**: Place orders with address details and track past orders (`/my-orders`, `/order-details/:orderId`).
- **Payment Gateway Integration**: Configured with Razorpay for handling payments.
- **RESTful API**: Clean Express.js backend architecture with structured controllers, models, and routes.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **React Router Dom (v7)**
- **Axios** (API communication)
- Vanilla CSS with responsive design

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (ODM)
- **JWT (JSON Web Tokens)** & **Cookie-Parser**
- **Bcrypt** (password encryption)
- **Razorpay SDK**

---

## 📁 Repository Structure

```text
Shopkart/
├── backend/
│   ├── config/             # Database and configuration helpers
│   ├── controllers/        # Route controllers (auth, cart, order, product, wishlist)
│   ├── middlewares/        # Authentication & validation middleware
│   ├── models/             # Mongoose schemas (Customer, Product, Cart, Order, etc.)
│   ├── routes/             # Express API route definitions
│   ├── utils/              # Helper utilities
│   ├── .env.example        # Environment variable template
│   ├── index.js            # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── pages/          # App views (Home, Products, Cart, Checkout, Orders, Auth)
│   │   ├── App.jsx         # Routes and core application setup
│   │   ├── CartContext.jsx # Global Cart state provider
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/hamsinivmothkur-stack/<repo-name>.git
cd Shopkart
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `backend/` directory based on `.env.example`:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     ```
4. Start the backend server:
   ```bash
   node index.js
   ```
   *The backend will run on `http://localhost:5000` (or the configured `PORT`).*

---

### 3. Frontend Setup

1. In a new terminal window, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🔒 Security Best Practices
- **No secrets in version control**: All `.env` files are ignored in `.gitignore`.
- Passwords are encrypted using salted bcrypt hashing.
- Protected routes require valid JWT tokens.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
