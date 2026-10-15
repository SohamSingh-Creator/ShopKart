import React from "react";

const CheckoutForm = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for changed field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
        Shipping Address
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
              errors.fullName
                ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            maxLength={10}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
              errors.phone
                ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Address (House No, Street, Landmark) *
        </label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          placeholder="Flat 402, Sunshine Apartments, MG Road"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
            errors.addressLine1
              ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
              : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
          }`}
        />
        {errors.addressLine1 && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.addressLine1}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Bengaluru"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
              errors.city
                ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Karnataka"
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
              errors.state
                ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
            }`}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.state}</p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Pincode (6 digits) *
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="560001"
            maxLength={6}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 ${
              errors.pincode
                ? "border-rose-300 focus:ring-rose-200 bg-rose-50/30"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
            }`}
          />
          {errors.pincode && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.pincode}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
