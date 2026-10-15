import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// @desc    Add product to cart or increment quantity if already present
// @route   POST /cart/:productId
// @access  Protected
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);

    const existingItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Product already in cart -> increment quantity
      const newQuantity = customer.cart[existingItemIndex].quantity + 1;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more units. Available stock is ${product.stock}.`,
        });
      }
      customer.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // New item in cart
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }
      customer.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: customer.cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error adding product to cart",
      error: error.message,
    });
  }
};

// @desc    Get current user's populated cart
// @route   GET /cart
// @access  Protected
export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Filter out null products in case product was deleted
    const validCart = (customer.cart || []).filter((item) => item.product !== null);

    return res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching cart",
      error: error.message,
    });
  }
};

// @desc    Update quantity of a product in cart
// @route   PATCH /cart/:productId
// @access  Protected
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || !Number.isInteger(numQuantity) || numQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be an integer greater than or equal to 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const customer = await Customer.findById(req.user._id);

    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    if (numQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`,
      });
    }

    customer.cart[itemIndex].quantity = numQuantity;
    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: customer.cart,
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating cart quantity",
      error: error.message,
    });
  }
};

// @desc    Remove product from cart
// @route   DELETE /cart/:productId
// @access  Protected
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const customer = await Customer.findById(req.user._id);

    const existsInCart = customer.cart.some(
      (item) => item.product.toString() === productId.toString()
    );

    if (!existsInCart) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await customer.save();

    await customer.populate({
      path: "cart.product",
      select: "name price image stock category description",
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: customer.cart,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error removing product from cart",
      error: error.message,
    });
  }
};
