import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { cartAPI, wishlistAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await cartAPI.getCart();
      setCartItems(response.data?.cart || []);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setWishlistLoading(true);
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlistItems(response.data?.wishlist || []);
    } catch (err) {
      console.warn("Failed to load wishlist:", err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Synchronize when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      const response = await cartAPI.addToCart(productId);
      setCartItems(response.data?.cart || []);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await cartAPI.updateQuantity(productId, quantity);
      setCartItems(response.data?.cart || []);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      setCartItems(response.data?.cart || []);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Clear cart in state (called after successful order placement)
  const clearCart = () => {
    setCartItems([]);
  };

  // Toggle or add/remove wishlist item
  const toggleWishlist = async (productId) => {
    try {
      const response = await wishlistAPI.toggleWishlist(productId);
      await fetchWishlist();
      return { success: true, saved: response.data?.saved };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => (item._id || item) !== productId));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => (item._id || item).toString() === productId.toString());
  };

  // Derived values from cart state
  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const wishlistCount = wishlistItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        loading,
        wishlistLoading,
        error,
        fetchCart,
        fetchWishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        totalCount,
        subtotal,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
