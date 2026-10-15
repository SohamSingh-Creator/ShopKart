import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import { ShoppingCart, ShoppingBag, ArrowRight, RefreshCw } from "lucide-react";

const Cart = () => {
  const { cartItems, loading, error, fetchCart, subtotal, totalCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Shopping Cart</span>
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalCount} {totalCount === 1 ? "unit" : "units"} in {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition w-fit"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium text-sm">Loading your cart...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-rose-200 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900">Unable to load your cart.</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button
            onClick={fetchCart}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        /* Empty State */
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Your cart is empty 🛒</h2>
            <p className="text-sm text-slate-500 max-w-sm">
              Looks like you haven't added anything yet. Explore our products and add your favorites!
            </p>
          </div>
          <Link
            to="/products"
            className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        /* Populated Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, idx) => (
              <CartItem key={item._id || item.product?._id || idx} item={item} />
            ))}
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1 sticky top-24">
            <OrderSummary
              items={cartItems}
              subtotal={subtotal}
              onAction={handleProceedToCheckout}
              actionLabel={
                <span className="flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
