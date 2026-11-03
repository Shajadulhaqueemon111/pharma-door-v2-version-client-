/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CalculateSummary from "./CalculateSummery";
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

const AddToCart = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleCartUpdated = () => {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(existingCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    handleCartUpdated();

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const medicine = location.state?.medicine;

    if (medicine) {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const isAlreadyInCart = existingCart.some(
        (item: any) => item._id === medicine._id,
      );

      if (!isAlreadyInCart) {
        const newMedicine = { ...medicine, quantity: 1 };
        const updatedCart = [...existingCart, newMedicine];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
        setIsOpen(true);
      }

      // Clear location.state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDelete = (indexToDelete: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToDelete);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (index: number, type: "inc" | "dec") => {
    const updatedCart = [...cartItems];

    if (type === "inc") {
      updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    } else if (type === "dec" && (updatedCart[index].quantity || 1) > 1) {
      updatedCart[index].quantity -= 1;
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-40 bg-gradient-to-l from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white pl-3.5 pr-2.5 py-3 rounded-l-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group cursor-pointer border-t border-b border-l border-teal-500/30"
        aria-label="View Cart"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {totalItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalItemCount}
            </span>
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-100">
            Cart
          </span>
          <span className="text-xs font-extrabold">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
              <p className="text-xs text-slate-400">
                {cartItems.length} unique medicines added
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Your cart is empty
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Looks like you haven&apos;t added any medicines yet. Explore our verified products.
              </p>
              <Link
                to="/products/all-products"
                onClick={() => setIsOpen(false)}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Browse Medicines</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="pt-3 first:pt-0 flex items-center gap-3 group"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                  <img
                    src={item?.medicineImage}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {item.brand && `Brand: ${item.brand}`}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold text-teal-700">
                      ৳{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() => handleQuantityChange(index, "dec")}
                        className="px-2 py-1 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-l-lg transition text-xs cursor-pointer"
                        title="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(index, "inc")}
                        className="px-2 py-1 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-r-lg transition text-xs cursor-pointer"
                        title="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
            <CalculateSummary onCloseDrawer={() => setIsOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
};

export default AddToCart;
