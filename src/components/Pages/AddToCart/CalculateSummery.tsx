/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      0
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

  return (
    <div className="mt-8 p-6 border border-green-300 rounded-xl bg-gradient-to-r from-white to-green-50 shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
        🧾 Cart Summary
      </h2>

      <div className="space-y-2 text-gray-700 text-base">
        <p>
          🧮 Total Price:{" "}
          <span className="font-semibold">{summary.total} TK</span>
        </p>
        <p>
          💸 Tax (5%): <span className="font-semibold">{summary.tax} TK</span>
        </p>
        <p>
          🧾 Commission (5%):{" "}
          <span className="font-semibold">{summary.commission} TK</span>
        </p>
        <p className="text-lg font-bold text-green-700 mt-2">
          💰 Final Amount: <span>{summary.finalTotal} TK</span>
        </p>
      </div>

      <Link to="/medicines/checkout">
        <button
          onClick={() => {
            onCloseDrawer?.();
          }}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          🛒 Checkout
        </button>
      </Link>
    </div>
  );
};

export default CalculateSummary;
