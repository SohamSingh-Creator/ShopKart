import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

export const protect = async (req, res, next) => {
  let token = req.cookies?.token;

  // Also support Authorization header Bearer token for Postman testing
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "shopkart_super_secret_jwt_key_2026_very_secure";
    const decoded = jwt.verify(token, secret);

    const customer = await Customer.findById(decoded.id).select("-password");

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, customer not found",
      });
    }

    req.user = customer;
    req.customer = customer; // alias
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};
