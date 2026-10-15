import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { connectDB } from "../config/db.js";

dotenv.config();

export const sampleProducts = [
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with tactile blue switches and detachable USB-C braided cable.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    stock: 15,
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stock: 20,
  },
  {
    name: "Ultra-Fast Gaming Mouse",
    description: "Lightweight optical gaming mouse with 16,000 DPI sensor and programmable macro buttons.",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    stock: 25,
  },
  {
    name: "Smart Fitness Watch",
    description: "Waterproof smartwatch with AMOLED display, heart rate monitor, and GPS tracking.",
    price: 3499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 12,
  },
  {
    name: "Classic Denim Jacket",
    description: "Vintage washed authentic denim jacket with durable metal buttons and dual chest pockets.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    stock: 30,
  },
  {
    name: "Running Athletic Sneakers",
    description: "Breathable mesh lightweight sneakers engineered for distance running and everyday comfort.",
    price: 3999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stock: 18,
  },
  {
    name: "Clean Code Handbook",
    description: "A handbook of agile software craftsmanship for building maintainable and clean systems.",
    price: 899,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
    stock: 40,
  },
  {
    name: "Designing Data-Intensive Applications",
    description: "The definitive guide to the architecture and principles under high-scale data systems.",
    price: 1499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    stock: 22,
  },
  {
    name: "Ergonomic Desk Lamp",
    description: "Dimmable LED desk lamp with eye-caring warm/cool lighting modes and built-in USB charging port.",
    price: 1599,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    stock: 14,
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted matte ceramic mugs for rich espresso, latte, and artisan coffee.",
    price: 799,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    stock: 35,
  },
];

export const seedProductsIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[Seed] No products found. Seeding initial catalog...");
      await Product.insertMany(sampleProducts);
      console.log(`[Seed] Successfully seeded ${sampleProducts.length} products.`);
    }
  } catch (err) {
    console.error("[Seed] Error auto-seeding products:", err.message);
  }
};

// If run directly from terminal
if (process.argv[1]?.endsWith("seedProducts.js")) {
  (async () => {
    try {
      await connectDB();
      console.log("[Seed Script] Clearing old products...");
      await Product.deleteMany({});
      await Product.insertMany(sampleProducts);
      console.log(`[Seed Script] Successfully seeded ${sampleProducts.length} products.`);
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
