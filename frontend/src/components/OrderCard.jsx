import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Package, ChevronRight, CheckCircle2, Clock } from "lucide-react";

const OrderCard = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONFIRMED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "SHIPPED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-500">Order ID:</span>
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              #{order._id}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
              order.status
            )}`}
          >
            {order.status}
          </span>

          {/* Payment Badge */}
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="py-4 space-y-3">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
              <p className="text-xs text-slate-500">
                Quantity: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
              </p>
            </div>
            <span className="text-sm font-bold text-slate-900">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-500">Total Paid: </span>
          <span className="text-base font-extrabold text-indigo-600">
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </span>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
