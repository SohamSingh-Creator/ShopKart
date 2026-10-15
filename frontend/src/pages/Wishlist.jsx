import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import WishlistCard from "../components/WishlistCard";
import { Heart, ShoppingBag, RefreshCw } from "lucide-react";

const Wishlist = () => {
  const { wishlistItems, wishlistLoading, fetchWishlist } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Wishlist</span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "product" : "products"} saved
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
      {wishlistLoading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium text-sm">Loading your wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        /* Empty State */
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Your wishlist is empty ❤️</h2>
            <p className="text-sm text-slate-500 max-w-sm">
              Save products you love and find them here later when you are ready to buy.
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
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <WishlistCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
