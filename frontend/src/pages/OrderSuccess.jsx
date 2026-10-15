import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { orderAPI } from "../services/api";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      orderAPI
        .getOrderById(id)
        .then((res) => {
          setOrder(res.data?.order);
        })
        .catch((err) => console.error("Error fetching order:", err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  return (
    <div className="min-h-[80vh] max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="w-full bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Payment Verified & Confirmed
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Thank you for shopping with ShopKart. Your order has been registered and is now being
            processed for dispatch.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-sm text-left">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase">Order ID</span>
            <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
              #{id}
            </span>
          </div>

          {order && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Amount</span>
                <span className="text-base font-extrabold text-indigo-600">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Order Status</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {order.status || "PLACED"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Payment</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {order.paymentStatus || "PAID"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition text-sm"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/products"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
