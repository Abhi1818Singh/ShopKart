# ShopKart 🛍️

A modern, full-stack e-commerce web application featuring a brutalist high-contrast aesthetic, customizable background themes, customer authentication, product catalog, wishlist, shopping cart, and Razorpay checkout integration.

---

## 🚀 Features

- **🔐 Customer Authentication & Authorization**: Secure signup, login, and profile management using JSON Web Tokens (JWT) stored in HTTP-only cookies.
- **📦 Product Catalog & Collections**: Browse products with search, category filtering, price sorting, and detailed product specifications.
- **❤️ Wishlist**: Save favorite items with persistent MongoDB synchronization.
- **🛒 Shopping Cart**: State-managed cart with quantity controls, subtotal computation, and persistent synchronization via Redux Toolkit.
- **💳 Payments & Orders**: Order creation, Razorpay payment processing, order history, and detailed status tracking.
- **🎨 Modern Brutalist Design System**: Neon lime accents (`#d4ff00`), bold Anton typography, responsive layout, and real-time background theme switcher (Blue 🩵, Pink 🌸, Black 🖤).

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **Redux Toolkit** (Cart state management)
- **React Router v7**
- **Axios** (API communication with credentials)
- **Vanilla CSS** with responsive design tokens and Google Font *Anton*

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (ODM)
- **JWT (`jsonwebtoken`)** & **`cookie-parser`**
- **Razorpay** SDK for payment checkout

---

## 📦 Project Structure

```
ShopKart/
├── client/                 # React frontend
│   ├── public/             # Static assets (logos, hero graphics)
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, ProductCard, etc.)
│       ├── features/       # Redux slices (cartSlice)
│       ├── pages/          # Application views (Home, Products, Orders, etc.)
│       ├── services/       # Axios API client
│       └── index.css       # Complete design system & themes
└── server/                 # Express REST API
    ├── controllers/        # Request handlers (auth, product, wishlist, order, etc.)
    ├── models/             # Mongoose schemas
    ├── routes/             # Express API route declarations
    └── index.js            # Server entry point
```

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Abhi1818Singh/ShopKart.git
cd ShopKart
```

### 2. Configure Backend Environment
Create a `.env` file in the `server/` directory (see `server/.env.example`):
```env
PORT=8008
dbURL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Seed Products (Optional)
```bash
cd server
node seed.js
```

### 5. Run the Application
In separate terminal windows:
```bash
# Terminal 1: Start Server
cd server
npm run dev

# Terminal 2: Start Client
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.
