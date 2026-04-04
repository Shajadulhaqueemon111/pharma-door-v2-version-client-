/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CalculateSummary from "./CalculateSummery";
import { BsBagFill } from "react-icons/bs";
// type Props = {
//   onCloseDrawer?: () => void;
// };
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
        (item: any) => item._id === medicine._id
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
      updatedCart[index].quantity += 1;
    } else if (type === "dec" && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 
        bg-gradient-to-l from-[#0f766e] to-[#22d3ee] text-white 
        px-1 py-4 rounded-l-full shadow-xl hover:from-[#0e9488] hover:to-[#06b6d4] 
        transition-all duration-300 ease-in-out text-lg font-semibold flex items-center gap-3"
      >
        <BsBagFill className="text-2xl" />
        <span className="tracking-wide">Cart ({cartItems.length})</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({cartItems.length})</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-gray-900 font-bold text-2xl"
            aria-label="Close Drawer"
          >
            &times;
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 && (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border rounded p-2 shadow-sm"
            >
              <img
                src={item?.medicineImage}
                alt={item.name}
                className="w-16 h-16 object-contain"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                <p className="text-green-600 font-bold">
                  Price: {item.price} TK
                </p>

                {/* Quantity control */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQuantityChange(index, "dec")}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    –
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(index, "inc")}
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-4 border-t">
          <CalculateSummary onCloseDrawer={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default AddToCart;
