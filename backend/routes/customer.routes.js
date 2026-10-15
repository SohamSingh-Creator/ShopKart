import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  logoutCustomer,
  changePassword,
} from "../controllers/customer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", protect, getCustomerProfile);
router.post("/logout", protect, logoutCustomer);
// Also allow logout without protect in case token is expired
router.get("/logout", logoutCustomer);
router.patch("/change-password", protect, changePassword);

export default router;
