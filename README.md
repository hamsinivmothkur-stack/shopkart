# 🛒 ShopKart — E-Commerce Web Application

ShopKart is a full-stack e-commerce web application where users can browse products, view product details, add items to their shopping cart, and complete checkout using an online payment integration.

## ✨ Features

- **Product Listing:** Browse available products.
- **Product Details:** View product descriptions, prices, categories, and stock.
- **Shopping Cart:** Add products to the cart and manage quantities.
- **User Authentication:** Register and log in securely.
- **Checkout:** Enter shipping details and proceed to payment.
- **Online Payments:** Razorpay payment integration.
- **My Orders:** View previously placed orders.

> Only keep the features above that are actually working in your project.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- Razorpay

## 📁 Project Structure

```text
Shopkart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
└── client/
    ├── public/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── App.jsx
    ├── index.html
    └── package.json
```

*Your actual folders may differ; adjust this structure to match your repository.*

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm
- A MongoDB Atlas account or another configured MongoDB instance
- Razorpay test credentials, if testing payments

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd Shopkart
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Use the environment variable names expected by your code. Never commit real credentials or passwords.

Start the backend:

```bash
node index.js
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🔐 Security

- Sensitive configuration is stored in environment variables.
- Protected backend routes use authentication middleware.
- Payment verification is performed on the backend.

## 💳 Payment Testing

Razorpay test mode can be used to test the checkout flow without collecting real payments. Use test credentials and the supported test payment methods.

## 🎯 Learning Outcomes

This project helped me practise:

- Building a React frontend.
- Creating REST API endpoints using Express.js.
- Connecting a backend to MongoDB using Mongoose.
- Managing authentication and protected routes.
- Implementing shopping cart and order management.
- Integrating and verifying online payments.

## 👩‍💻 Author

**Hamsini V. Mothkur**

