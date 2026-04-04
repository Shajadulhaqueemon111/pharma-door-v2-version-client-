/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Checkout = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

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

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  const tax = total * 0.05;
  const commission = total * 0.05;
  const finalTotal = total + tax - commission;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      alert("Please fill in your name, email,phone and address.");
      return;
    }

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
    console.log(orderData);
    try {
      const response = await fetch(
        "https://pharma-door-backend.vercel.app/api/v1/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to submit order.");
      }

      const data = await response.json();
      console.log(data);

      if (data?.data?.result === "true" && data?.data?.payment_url) {
        toast.success(" Redirecting to payment gateway...");
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        // Redirect to Aamarpay payment gateway
        window.location.href = data?.data.payment_url;
      } else {
        toast.error(" Payment URL not found. Please try again.");
      }
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(" Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
        🧾 Checkout
      </h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">
          Home Address
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter your home address"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-300"
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
        <p className="text-sm text-gray-700">
          🧮 Total: <strong>{total.toFixed(2)} TK</strong>
        </p>
        <p className="text-sm text-gray-700">
          💸 Tax (5%): <strong>{tax.toFixed(2)} TK</strong>
        </p>
        <p className="text-sm text-gray-700">
          🧾 Commission (5%): <strong>{commission.toFixed(2)} TK</strong>
        </p>
        <p className="text-lg font-bold text-green-800 mt-2">
          💰 Payable: {finalTotal.toFixed(2)} TK
        </p>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
      >
        ✅ Confirm Order
      </button>
    </div>
  );
};

export default Checkout;
