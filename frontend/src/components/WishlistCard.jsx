import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Eye, ShoppingCart, Check } from "lucide-react";

const WishlistCard = ({ product }) => {
  const { removeFromWishlist, addToCart } = useCart();
  const [removing, setRemoving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await removeFromWishlist(product._id);
    setRemoving(false);
  };

  const handleMoveToCart = async () => {
    setAdding(true);
    const res = await addToCart(product._id);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
    setAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700">
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/products/${product._id}`}
          className="text-base font-semibold text-slate-900 hover:text-indigo-600 line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} units left` : "Out of Stock"}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </Link>

          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
          >
            {removing ? (
              <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleMoveToCart}
          disabled={adding || product.stock <= 0}
          className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:bg-slate-200 disabled:text-slate-400"
        >
          {adding ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Move to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
