/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";

type Props = {
  onCloseDrawer?: () => void;
};

const CalculateSummary = ({ onCloseDrawer }: Props) => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const updateCartFromStorage = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  };

  useEffect(() => {
    updateCartFromStorage();

    window.addEventListener("cartUpdated", updateCartFromStorage);

    return () => {
      window.removeEventListener("cartUpdated", updateCartFromStorage);
    };
  }, []);

  const calculate = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0,
    );
    const tax = total * 0.05;
    const commission = total * 0.05;
    const finalTotal = total + tax - commission;

    return {
      total: total.toFixed(2),
      tax: tax.toFixed(2),
      commission: commission.toFixed(2),
      finalTotal: finalTotal.toFixed(2),
    };
  };

  const summary = calculate();

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-200/60 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
          {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
        </span>
      </h3>

      <div className="py-3 space-y-2 text-xs sm:text-sm text-slate-600">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold text-slate-800">৳{summary.total}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Govt. VAT / Tax (5%)</span>
          <span className="font-semibold text-slate-800">+৳{summary.tax}</span>
        </div>

        <div className="flex justify-between text-emerald-600">
          <span>Promotional Discount (5%)</span>
          <span className="font-semibold">-৳{summary.commission}</span>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-900">Total Payable</span>
          <span className="text-lg font-extrabold text-teal-700">
            ৳{summary.finalTotal}
          </span>
        </div>
      </div>

      <Link to="/medicines/checkout" onClick={() => onCloseDrawer?.()}>
        <button className="w-full mt-3 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-700/20 hover:shadow-teal-700/40 transition flex items-center justify-center gap-2 cursor-pointer">
          <ShoppingCart size={16} />
          <span>Proceed to Checkout</span>
          <ArrowRight size={16} />
        </button>
      </Link>

      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck size={13} className="text-teal-600" />
        <span>100% Secure Checkout Guarantee</span>
      </div>
    </div>
  );
};

export default CalculateSummary;
