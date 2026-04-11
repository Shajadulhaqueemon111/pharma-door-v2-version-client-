import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import toast from "react-hot-toast";

type AnimalMedicineType = {
  _id: string;
  name: string;

  category: string;
  price: string;
  stock: string;
  medicineImage: string;
};

const AnimalMedicineDetails = () => {
  const { _id } = useParams();
  const [medicine, setMedicine] = useState<AnimalMedicineType | null>(null);

  useEffect(() => {
    fetch(
      `https://pharma-door-backend.vercel.app/api/v1/animal-medicine/${_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setMedicine(data.data || null);
      })
      .catch((err) => console.error("Failed to load medicine details:", err));
  }, [_id]);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const productWithModel = {
      ...medicine,
      quantity: 1,
      model: "animalMedicine",
    };

    const updatedCart = [...existingCart, productWithModel];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    toast.success("Medicine added to cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!medicine) {
    return (
      <div className="flex justify-center mt-20">
        <ScaleLoader color="#2cabab" height={35} />
      </div>
    );
  }

  return (
    <div className="mt-4 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Image and SafetyAdvice */}
        <div className="flex flex-col items-center">
          <img
            src={medicine.medicineImage}
            alt={medicine.name}
            className="w-60 h-60 object-contain mb-4"
          />
          <SafetyAdvice />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="bg-gradient-to-bl from-violet-500 to-fuchsia-500 text-white p-3 rounded-md mb-4 text-center">
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              ব্যবসার জন্য পাইকারি দামে কিনতে চাইলে
              <Link to="/register">
                <button className="btn btn-secondary ml-2">Register</button>
              </Link>
            </p>
          </div>

          <h1 className="text-2xl font-bold text-red-500 mb-2">
            {medicine.name}
          </h1>

          <p className="text-gray-800 font-bold mb-2">
            Stock Quantity:{" "}
            <span className="text-emerald-500">{medicine.stock}</span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Price: <span className="text-emerald-500">{medicine.price} TK</span>
          </p>

          <p className="text-gray-800 font-bold mb-4">
            Category:{" "}
            <span className="text-emerald-500">{medicine.category}</span>
          </p>

          <button
            onClick={handleAddToCart}
            className="btn bg-blue-500 hover:bg-blue-700 text-white w-full"
          >
            Add-To-Cart
          </button>

          <div className="mt-4">
            <p className="font-bold mb-2">Additional Offer</p>
            <AdditionalOffer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalMedicineDetails;
