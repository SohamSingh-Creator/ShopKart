import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { orderAPI } from "../services/api";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CreditCard,
  MapPin,
  AlertCircle,
} from "lucide-react";

const STATUS_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await orderAPI.getOrderById(id);
      setOrder(response.data?.order);
    } catch (err) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Bonus Challenge (+10 Marks): Dev status updater
  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await orderAPI.updateStatus(id, newStatus);
      if (res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium text-sm">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500">{error || "Could not retrieve order details."}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Order
              </span>
              <h1 className="text-xl font-black text-slate-900 font-mono">#{order._id}</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800">
              {order.status}
            </span>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                order.paymentStatus === "PAID"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Status Progression Tracker */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Delivery Timeline
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUS_STEPS.map((step, idx) => {
              const isDone = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step}
                  className={`p-3 rounded-2xl border text-center transition ${
                    isDone
                      ? "bg-indigo-50/70 border-indigo-200 text-indigo-900"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? "text-indigo-600 underline" : ""
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bonus Challenge: Test status switcher */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Dev Status Switcher (Bonus):</span>
            {STATUS_STEPS.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updatingStatus || order.status === status}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
                  order.status === status
                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Purchased Items List */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-600" />
            <span>Order Items Snapshot</span>
          </h2>

          <div className="divide-y divide-slate-100 space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 pt-3 first:pt-0">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Price at purchase: ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-sm text-slate-900">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Grand Total</span>
            <span className="text-2xl font-black text-indigo-600">
              ₹{order.totalAmount?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Delivery Address</span>
            </h3>

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pincode}
              </p>
              <p className="pt-1 text-slate-500">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payment Details</span>
            </h3>

            <div className="text-xs text-slate-600 space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Status
                </span>
                <span className="font-bold text-emerald-700">{order.paymentStatus}</span>
              </div>

              {order.razorpayOrderId && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Razorpay Order ID
                  </span>
                  <span className="font-mono text-slate-800">{order.razorpayOrderId}</span>
                </div>
              )}

              {order.razorpayPaymentId && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Razorpay Payment ID
                  </span>
                  <span className="font-mono text-slate-800">{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
