/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  Banknote,
  ArrowRight,
  FileText,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import { useAuth } from "../privateRoute/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Online" | "COD">("Online");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    postalCode: "1200",
    customerNotes: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );
  const tax = Math.round(total * 0.05); // 5% VAT
  const deliveryCharge = total >= 1000 ? 0 : 60; // Free delivery over 1000 BDT
  const discount = Math.round(total * 0.05); // 5% Promo discount
  const finalTotal = Math.max(0, total + tax + deliveryCharge - discount);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      toast.error("Please fill in your name, email, phone and delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    const token = localStorage.getItem("accessToken");

    const orderData = {
      userId: user?._id || undefined,
      user: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      },
      shippingAddress: {
        fullName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        notes: form.customerNotes,
      },
      customerNotes: form.customerNotes,
      products: cartItems.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity || 1,
        pharmacist: item.createdBy?._id || item.pharmacist,
        model: item.model || "medicine",
      })),
      paymentMethod,
      total,
      tax,
      discount,
      deliveryCharge,
      finalTotal,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to submit order.");
      }

      // Online payment redirect
      if (paymentMethod === "Online") {
        if (data?.data?.result === "true" && data?.data?.payment_url) {
          toast.success("Redirecting to secured payment gateway...");
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
          window.location.href = data.data.payment_url;
          return;
        } else {
          toast.error("Payment session could not be established. Please try COD or retry.");
        }
      } else {
        // Cash on delivery
        toast.success("Order placed successfully with Cash on Delivery!");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/profile?tab=orders");
        return;
      }
    } catch (error: any) {
      console.error("Order submission error:", error);
      toast.error(error?.message || "Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Title */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Checkout & Order Confirmation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Enter your delivery details to receive authentic medicines right at your doorstep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Patient Delivery Details Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Patient & Delivery Address
              </h2>
              <p className="text-xs text-slate-400">
                Medicines will be dispatched to this recipient
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  City / District *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Dhaka"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="1200"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Complete Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                <textarea
                  name="address"
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat No, Road No, Area / Thana, City"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition resize-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Delivery Instructions / Note (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                <textarea
                  name="customerNotes"
                  rows={2}
                  value={form.customerNotes}
                  onChange={handleChange}
                  placeholder="e.g. Call before arrival, leave with security guard, urgent insulin required"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Payment Method *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod("Online")}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === "Online"
                      ? "border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-teal-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-xs sm:text-sm">Online Payment</p>
                    <p className="text-[11px] text-slate-400">bKash, Nagad, Cards & NetBanking</p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === "COD"
                      ? "border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-teal-300"
                  }`}
                >
                  <Banknote className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-xs sm:text-sm">Cash on Delivery</p>
                    <p className="text-[11px] text-slate-400">Pay cash upon doorstep arrival</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-800/50 flex items-center gap-3">
            <ShieldCheck size={20} className="text-teal-700 dark:text-teal-400 shrink-0" />
            <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
              Your details are encrypted and securely used solely for medicine delivery compliance and pharmacy logs.
            </p>
          </div>
        </div>

        {/* Right: Order Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag size={18} className="text-teal-600 dark:text-teal-400" />
              <span>Order Summary</span>
            </h2>
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 px-2.5 py-1 rounded-full">
              {cartItems.length} Products
            </span>
          </div>

          {/* Cart items preview */}
          {cartItems.length > 0 ? (
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800">
              {cartItems.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={item.medicineImage || item.image || "/placeholder-pill.png"}
                      alt={item.name}
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity || 1} × ৳{item.price}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-white shrink-0">
                    ৳{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Your cart is currently empty.{" "}
              <Link to="/products/all-products" className="text-teal-600 dark:text-teal-400 font-bold underline">
                Browse medicines
              </Link>
            </div>
          )}

          {/* Cost breakdown */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Cart Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Govt. VAT (5%)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">+৳{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-teal-600" /> Delivery Fee
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE (Orders &gt; 1000৳)</span>
                ) : (
                  `+৳${deliveryCharge.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Promo Discount (5%)</span>
              <span className="font-semibold">-৳{discount.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900 dark:text-white">Total Payable</span>
              <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-400">
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
            {paymentMethod === "Online" ? <CreditCard size={18} /> : <Banknote size={18} />}
            <span>
              {submitting
                ? "Processing Order..."
                : paymentMethod === "Online"
                ? "Proceed to Secured Payment"
                : "Confirm Cash on Delivery Order"}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
