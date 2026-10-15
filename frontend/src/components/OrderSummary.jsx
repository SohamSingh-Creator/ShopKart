import React from "react";
import { ShieldCheck, Truck } from "lucide-react";

const OrderSummary = ({ items, subtotal, onAction, actionLabel, loading, disabled }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
        Order Summary
      </h2>

      {/* Itemized List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
        {items.map((item, idx) => {
          const product = item.product || item;
          const qty = item.quantity || 1;
          const price = product.price || 0;
          return (
            <div key={idx} className="flex items-center justify-between pt-2 first:pt-0 text-sm">
              <div className="flex-1 pr-2">
                <p className="font-medium text-slate-800 line-clamp-1">{product.name}</p>
                <p className="text-xs text-slate-500">
                  Qty: {qty} × ₹{price.toLocaleString("en-IN")}
                </p>
              </div>
              <span className="font-semibold text-slate-900">
                ₹{(price * qty).toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Calculation details */}
      <div className="pt-3 border-t border-slate-100 space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-slate-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            Standard Delivery
          </span>
          <span className="text-emerald-600 font-semibold uppercase text-xs">FREE</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
        <span className="text-base font-bold text-slate-900">Total Amount</span>
        <span className="text-2xl font-extrabold text-indigo-600">
          ₹{subtotal.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          disabled={disabled || loading}
          className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            actionLabel || "Proceed"
          )}
        </button>
      )}

      {/* Security badge */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Secure Payment powered by Razorpay</span>
      </div>
    </div>
  );
};

export default OrderSummary;
