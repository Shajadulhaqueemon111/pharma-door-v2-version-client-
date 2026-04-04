import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import brandImage from "../../../assets/brand1.png";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";

type MedicineDetails = {
  _id: string;
  name: string;
  brand: string;
  stock: string;
  price: string;
  medicineImage: string;
};

const PrescribeMedicineDetails = () => {
  const { _id } = useParams();
  const [medicine, setMedicine] = useState<MedicineDetails | null>(null);

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/medicine")
      .then((res) => res.json())
      .then((result) => {
        const medicines = result.data;
        if (Array.isArray(medicines)) {
          const found = medicines.find((item) => item._id === _id);
          setMedicine(found || null);
        } else {
          console.error("Expected medicines array but got:", medicines);
          setMedicine(null);
        }
      })
      .catch((err) => console.error("Failed to load details:", err));
  }, [_id]);

  if (!medicine) {
    return (
      <div className="flex justify-center mt-20">
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
    <div className="mt-4 px-4 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Image and Safety */}
        <div className="flex flex-col items-center">
          <img
            src={medicine.medicineImage}
            alt={medicine.name}
            className="w-60 h-60 object-contain mb-4"
          />
          <SafetyAdvice />
        </div>

        {/* Details Section */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="bg-gradient-to-bl from-violet-500 to-fuchsia-500 rounded-md text-white py-2 px-4 mb-4">
            <span className="flex flex-col md:flex-row items-center gap-2 justify-between">
              ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চাইলে{" "}
              <Link to="/register">
                <button className="btn btn-secondary">Register</button>
              </Link>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-red-500 mb-2">
            {medicine.name}
          </h1>

          <p className="flex items-center gap-2 font-bold text-gray-700 mb-3">
            <img src={brandImage} alt="Brand" className="w-5 h-5" />
            <span className="text-emerald-500">{medicine.brand}</span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Price: <span className="text-emerald-500">{medicine.price} TK</span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Brand: <span className="text-emerald-500">{medicine.brand}</span>
          </p>
          <p className="text-gray-800 font-bold mb-2">
            Stock: <span className="text-emerald-500">{medicine.stock}</span>
          </p>

          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="btn bg-[#0E7673] text-white w-full"
            >
              Add To Cart
            </button>
          </div>

          <div className="mt-6">
            <p className="font-bold mb-2">Additional Offer</p>
            <AdditionalOffer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescribeMedicineDetails;
