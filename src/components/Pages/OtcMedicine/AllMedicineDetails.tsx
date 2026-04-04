import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import brandImage from "../../../assets/brand1.png";
import AdditionalOffer from "./AdditionalOffer";
import SafetyAdvice from "./SafetyAdvice";

type Medicine = {
  id: number;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  image: string;
};

const AllMedicineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    fetch("/alloticemedicine.json")
      .then((res) => res.json())
      .then((data: Medicine[]) => {
        const found = data.find((med) => med.id === Number(id));
        setMedicine(found || null);
      });
  }, [id]);

  if (!medicine) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Medicine not found.
      </div>
    );
  }

  return (
    <div className="mt-6 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Section: Image + Safety Advice */}
        <div className="flex flex-col items-center">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-56 h-56 object-contain mb-4"
          />
          <SafetyAdvice />
        </div>

        {/* Right Section: Details */}
        <div className="bg-white p-5 rounded-lg shadow-md w-full">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white p-4 rounded-md mb-4 text-center text-sm sm:text-base">
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চাইলে
              <Link to="/register">
                <button className="btn btn-secondary ml-0 sm:ml-2 mt-2 sm:mt-0">
                  Register
                </button>
              </Link>
            </p>
          </div>

          <h1 className="text-2xl font-bold text-red-500 mb-3">
            {medicine.name}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <img src={brandImage} alt="brand" className="w-5 h-5" />
            <span className="text-emerald-500 font-semibold">
              {medicine.brand}
            </span>
          </div>

          <p className="text-gray-800 font-bold mb-2">
            Generic:{" "}
            <span className="text-emerald-500">{medicine.generic}</span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Price: <span className="text-emerald-500">{medicine.price} TK</span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Dosage: <span className="text-emerald-500">{medicine.dosage}</span>
          </p>

          <p className="text-gray-800 font-bold mb-4">
            Form: <span className="text-emerald-500">{medicine.form}</span>
          </p>

          <Link to="/cart">
            <button className="btn bg-[#0E7673] hover:bg-[#095c5a] text-white w-full transition">
              Add-To-Cart
            </button>
          </Link>

          <div className="mt-6">
            <p className="font-bold mb-2">Additional Offer</p>
            <AdditionalOffer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllMedicineDetails;
