import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import brandImage from "../../../assets/brand1.png";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";

type SecloMedicine = {
  _id: string;
  name: string;
  brand: string;
  stock: string;
  price: string;
  medicineImage: string;
};

const SeclodetailsPage = () => {
  const { _id } = useParams();
  const [medicine, setMedicine] = useState<SecloMedicine | null>(null);

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/medicine")
      .then((res) => res.json())
      .then((resData) => {
        console.log("API response:", resData);
        console.log("Current ID from URL:", _id);
        const found = resData.data.find(
          (item: SecloMedicine) => item._id === _id
        );
        setMedicine(found || null);
      })
      .catch((err) => console.error("Failed to load details:", err));
  }, [_id]);

  if (!medicine) {
    return (
      <div className="text-center mt-10 text-red-600">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    toast.success("added medicine to cart");
    const updatedCart = [...existingCart, medicine];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={medicine.medicineImage}
            alt={medicine.name}
            className="w-60 h-60 object-contain mb-4"
          />
          <div className="w-full">
            <SafetyAdvice />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md space-y-4">
          <div className="h-14 bg-gradient-to-bl from-violet-500 to-fuchsia-500 rounded-md flex items-center px-4">
            <span className="text-white text-sm flex flex-wrap gap-2">
              ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চাইলে{" "}
              <Link to="/register">
                <button className="btn btn-secondary btn-sm">Register</button>
              </Link>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-red-500">{medicine.name}</h1>

          <p className="text-gray-700 font-bold flex items-center gap-2">
            <img src={brandImage} alt="Brand" className="w-6 h-6" />
            <span className="text-emerald-500">{medicine.brand}</span>
          </p>

          <p className="text-gray-800 font-bold">
            Stock:{" "}
            <span className="text-emerald-500 font-semibold">
              {medicine.stock}
            </span>
          </p>

          <p className="text-gray-800 font-bold">
            Price:{" "}
            <span className="text-emerald-500 font-semibold">
              {medicine.price} TK
            </span>
          </p>

          <p className="font-bold">
            Brand: <span className="text-emerald-500">{medicine.brand}</span>
          </p>

          <button
            onClick={handleAddToCart}
            className="btn bg-blue-500 hover:bg-blue-700 text-white w-full"
          >
            Add-To-Cart
          </button>

          {/* Additional Offer */}
          <div>
            <p className="font-bold mb-1">Additional Offer</p>
            <AdditionalOffer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeclodetailsPage;
