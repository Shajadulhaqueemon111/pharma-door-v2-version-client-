import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import brandImage from "../../../assets/brand1.png";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";

type MedicalProduct = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock_quantity: number;
  rating: number;
  color: string;

  medicineImage: string;
};

const ThermomiterDetails = () => {
  const { _id } = useParams();
  const [equipment, setEquipment] = useState<MedicalProduct | null>(null);

  useEffect(() => {
    fetch(`https://pharma-door-backend.vercel.app/api/v1/equipment/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setEquipment(data.data || null);
      })
      .catch((err) => console.error("Failed to load details:", err));
  }, [_id]);

  if (!equipment) {
    return (
      <div className="flex justify-center ">
        <ScaleLoader color="#2cabab" height={35} />
      </div>
    );
  }
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const productWithModel = {
      ...equipment,
      quantity: 1,
      model: "equipment",
    };

    const updatedCart = [...existingCart, productWithModel];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    toast.success(" Equipment added to cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start max-w-6xl mx-auto">
        {/* Image + Safety Advice */}
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <img
            src={equipment.medicineImage}
            alt={equipment.name}
            className="w-64 h-64 object-contain mb-4"
          />
          <SafetyAdvice />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 bg-white shadow-md p-4 rounded-md space-y-4">
          <div className="bg-gradient-to-bl from-violet-500 to-fuchsia-500 h-auto py-2 px-3 rounded text-white text-sm flex flex-wrap items-center justify-between gap-2">
            <span>ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চাইলে</span>
            <Link to="/register">
              <button className="btn btn-secondary text-xs">Register</button>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-red-500">{equipment.name}</h1>

          <p className="text-gray-700 font-bold flex items-center gap-2">
            <img src={brandImage} alt="Brand" className="w-5 h-5" />
            <span className="text-emerald-500">{equipment.brand}</span>
          </p>

          <p className="text-gray-800 font-bold">
            Stock Quantity:
            <span className="text-emerald-500 ml-2">
              {equipment.stock_quantity}
            </span>
          </p>

          <p className="text-gray-800 font-bold">
            Price:
            <span className="text-emerald-500 ml-2">{equipment.price} TK</span>
          </p>

          <p className="text-gray-800 font-bold">
            Category:
            <span className="text-emerald-500 ml-2">{equipment.category}</span>
          </p>

          <p className="text-gray-800 font-bold">
            Colour:
            <span className="text-emerald-500 ml-2">{equipment.color}</span>
          </p>

          <button
            onClick={handleAddToCart}
            className="btn bg-blue-500 hover:bg-blue-700 text-white w-full"
          >
            Add To Cart
          </button>

          {/* Extra */}
          <div>
            <p className="font-bold mb-1">Additional Offer</p>
            <AdditionalOffer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermomiterDetails;
