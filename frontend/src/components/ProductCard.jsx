import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [savingWishlist, setSavingWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const wishlisted = isWishlisted(product._id);
  const cartItem = cartItems.find(
    (item) => (item.product?._id || item.product) === product._id
  );
  const isInCart = !!cartItem;
  const isOutOfStock = product.stock <= 0;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSavingWishlist(true);
    setErrorMsg("");
    const res = await toggleWishlist(product._id);
    if (!res.success) {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(""), 3000);
    }
    setSavingWishlist(false);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isOutOfStock) return;

    setAddingToCart(true);
    setErrorMsg("");
    const res = await addToCart(product._id);
    if (res.success) {
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);
    } else {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(""), 3500);
    }
    setAddingToCart(false);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={savingWishlist}
          title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            wishlisted
              ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
              : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
          }`}
        >
          {savingWishlist ? (
            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`}
            />
          )}
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/products/${product._id}`}
          className="text-base font-semibold text-slate-900 hover:text-indigo-600 line-clamp-1 transition-colors"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-slate-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="text-right">
            {isOutOfStock ? (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">
                {product.stock} units left
              </span>
            )}
          </div>
        </div>

        {/* Action Error Message */}
        {errorMsg && (
          <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-1.5 rounded text-center">
            {errorMsg}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : cartSuccess
                ? "bg-emerald-600 text-white"
                : isInCart
                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            }`}
          >
            {addingToCart ? (
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : cartSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : isInCart ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>+1 More</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
