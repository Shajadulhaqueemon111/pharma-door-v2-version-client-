/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, User, Mail, Phone, MapPin, ShoppingBag, CreditCard, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0,
  );
  const tax = total * 0.05;
  const commission = total * 0.05;
  const finalTotal = total + tax - commission;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      toast.error("Please fill in your name, email, phone and delivery address.");
      return;
    }

    setSubmitting(true);

    const orderData = {
      user: form,
      products: cartItems.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity || 1,
        pharmacist: item.createdBy?._id,
        model: item.model || "medicine",
      })),
      total,
      tax,
      commission,
      finalTotal,
    };

    try {
      const response = await fetch(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit order.");
      }

      const data = await response.json();

      if (data?.data?.result === "true" && data?.data?.payment_url) {
        toast.success("Redirecting to secured payment gateway...");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        window.location.href = data?.data.payment_url;
      } else {
        toast.error("Payment URL not found. Please try again.");
      }
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Enter your delivery details to receive authentic medicines right at your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Patient Delivery Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Patient & Delivery Address
              </h2>
              <p className="text-xs text-slate-400">
                Medicines will be dispatched to this recipient
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Md. Tanvir Hasan"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Complete Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                <textarea
                  name="address"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat No, Road No, Area / Thana, City"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/60 flex items-center gap-3">
            <ShieldCheck size={20} className="text-teal-700 shrink-0" />
            <p className="text-xs text-teal-900 leading-relaxed">
              Your details are encrypted and securely used solely for medicine delivery compliance and pharmacy logs.
            </p>
          </div>
        </div>

        {/* Right: Order Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-teal-600" />
              <span>Order Summary</span>
            </h2>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
              {cartItems.length} Products
            </span>
          </div>

          {/* Cart items preview */}
          {cartItems.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={item.medicineImage}
                      alt={item.name}
                      className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-800 shrink-0">
                    ৳{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Your cart is currently empty.{" "}
              <Link to="/products/all-products" className="text-teal-600 font-bold underline">
                Browse medicines
              </Link>
            </div>
          )}

          {/* Cost breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Cart Subtotal</span>
              <span className="font-semibold text-slate-800">৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Govt. VAT (5%)</span>
              <span className="font-semibold text-slate-800">+৳{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Promo Discount (5%)</span>
              <span className="font-semibold">-৳{commission.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-extrabold text-teal-700">
                ৳{finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={handleCheckout}
            disabled={submitting || cartItems.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard size={18} />
            <span>{submitting ? "Processing Payment..." : "Proceed to Payment"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
