import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { customerAPI } from "../services/api";
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  Heart,
  ShoppingCart,
  Package,
  KeyRound,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { totalCount, wishlistCount } = useCart();

  // Change password modal / inline state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passSuccess, setPassSuccess] = useState("");
  const [passError, setPassError] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!passwords.oldPassword || !passwords.newPassword) {
      setPassError("Both old and new passwords are required");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPassError("New password must be at least 6 characters");
      return;
    }

    setChangingPass(true);
    try {
      const res = await customerAPI.changePassword(passwords);
      setPassSuccess(res.data?.message || "Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setPassError(err.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-12 text-white shadow-xl shadow-indigo-100">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold uppercase tracking-wider">
            Verified Customer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || "Shopper"}! 👋
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Your personalized ShopKart dashboard. Explore trending products, check your saved
            wishlist, and track your recent orders.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-white text-indigo-600 hover:bg-indigo-50 shadow-md transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-indigo-500/30 hover:bg-indigo-500/50 backdrop-blur text-white border border-white/20 transition text-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Card - Required by Lab 02 Task 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Customer Profile</h2>
              <p className="text-xs text-slate-500">ShopKart Authenticated User</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Full Name</p>
                <p className="font-medium text-slate-900">{user?.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Email Address</p>
                <p className="font-medium text-slate-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Phone Number</p>
                <p className="font-medium text-slate-900">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Wishlist Card */}
          <Link
            to="/wishlist"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900">{wishlistCount}</span>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 group-hover:text-rose-600 transition flex items-center justify-between">
                <span>Wishlist</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">Products you saved for later</p>
            </div>
          </Link>

          {/* Cart Card */}
          <Link
            to="/cart"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900">{totalCount}</span>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center justify-between">
                <span>Shopping Cart</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">Ready for checkout</p>
            </div>
          </Link>

          {/* Orders Card */}
          <Link
            to="/orders"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                Track
              </span>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition flex items-center justify-between">
                <span>My Orders</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-500 mt-1">View history & invoices</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500 mt-1">Verify old password to update your login key</p>

            {passSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="mt-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, oldPassword: e.target.value }))
                  }
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changingPass}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5"
                >
                  {changingPass && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
