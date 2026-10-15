import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const product = item.product;
  if (!product) return null;

  const currentQty = item.quantity;
  const maxStock = product.stock;

  const handleDecrease = async () => {
    if (currentQty <= 1 || updating) return;
    setUpdating(true);
    setErrorMsg("");
    const res = await updateQuantity(product._id, currentQty - 1);
    if (!res.success) {
      setErrorMsg(res.message);
    }
    setUpdating(false);
  };

  const handleIncrease = async () => {
    if (currentQty >= maxStock || updating) return;
    setUpdating(true);
    setErrorMsg("");
    const res = await updateQuantity(product._id, currentQty + 1);
    if (!res.success) {
      setErrorMsg(res.message);
    }
    setUpdating(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    setErrorMsg("");
    const res = await removeFromCart(product._id);
    if (!res.success) {
      setErrorMsg(res.message);
      setRemoving(false);
    }
  };

  const itemTotal = (product.price || 0) * currentQty;

  return (
    <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition hover:border-slate-300">
      {/* Product Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <Link
          to={`/products/${product._id}`}
          className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition"
        >
          {product.name}
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
        <p className="text-sm font-bold text-slate-900 mt-1">
          ₹{product.price?.toLocaleString("en-IN")}{" "}
          <span className="text-xs font-normal text-slate-500">each</span>
        </p>

        {maxStock <= 5 && (
          <p className="text-xs text-amber-600 font-medium mt-1">
            Only {maxStock} in stock!
          </p>
        )}

        {errorMsg && (
          <p className="text-xs text-rose-600 mt-1 bg-rose-50 p-1 rounded inline-block">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Quantity Controls & Item Total */}
      <div className="flex items-center gap-6">
        {/* Quantity Modifier */}
        <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
          <button
            onClick={handleDecrease}
            disabled={currentQty <= 1 || updating || removing}
            className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-10 text-center text-sm font-semibold text-slate-800">
            {updating ? (
              <span className="inline-block w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              currentQty
            )}
          </span>

          <button
            onClick={handleIncrease}
            disabled={currentQty >= maxStock || updating || removing}
            className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="w-24 text-right">
          <p className="text-base font-bold text-slate-900">
            ₹{itemTotal.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={removing || updating}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          title="Remove from cart"
        >
          {removing ? (
            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
