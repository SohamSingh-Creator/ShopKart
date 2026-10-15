import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { seedProductsIfEmpty } from "./utils/seedProducts.js";

// Routes
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup to allow credentials (cookies) from frontend
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
  })
);

// Standard body & cookie parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopKart Backend API is live & operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "ShopKart Service" });
});

// Mount routes as per the lab requirements + aliases for /api prefixes
app.use("/customers", customerRoutes);
app.use("/api/customers", customerRoutes);

app.use("/products", productRoutes);
app.use("/api/products", productRoutes);

app.use("/wishlist", wishlistRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("/cart", cartRoutes);
app.use("/api/cart", cartRoutes);

app.use("/orders", orderRoutes);
app.use("/api/orders", orderRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start Server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    await seedProductsIfEmpty();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🛍️  ShopKart Server running on port ${PORT}`);
      console.log(`🚀  Base URL: http://localhost:${PORT}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
