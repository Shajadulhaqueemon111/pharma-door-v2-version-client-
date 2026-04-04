import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import brandImage from "../../../assets/brand1.png";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";

interface OfferProduct {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  medicineImage: string;
  offerPercent: number;
  stock_quantity: number;
}

const SpecialOfferDetails = () => {
  const { _id } = useParams<{ _id: string }>();
  const [product, setProduct] = useState<OfferProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferProduct = async () => {
      try {
        const response = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/offer"
        );
        const found = response.data.data.find(
          (item: OfferProduct) => item._id === _id
        );
        setProduct(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferProduct();
  }, [_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Product not found.
      </div>
    );
  }

  const offerPrice =
    parseFloat(product.price) -
    (parseFloat(product.price) * product.offerPercent) / 100;

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productWithModel = {
      ...product,
      quantity: 1,
      model: "product",
    };
    toast.success("added medicine to cart");
    const updatedCart = [...existingCart, productWithModel];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };
  return (
    <div className="mt-6 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Section: Image + SafetyAdvice */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={product.medicineImage}
              alt={product.name}
              className="w-56 h-56 object-contain mb-4 rounded-lg shadow"
            />
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              {product.offerPercent}% OFF
            </div>
          </div>
          <SafetyAdvice />
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md w-full">
          {/* Banner */}
          <div className="bg-gradient-to-br from-pink-500 to-violet-500 text-white p-4 rounded-md mb-4 text-center text-sm sm:text-base">
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চাইলে
              <Link to="/register">
                <button className="btn btn-secondary ml-0 sm:ml-2 mt-2 sm:mt-0">
                  Register
                </button>
              </Link>
            </p>
          </div>

          {/* Product Info */}
          <h1 className="text-2xl font-bold text-red-500 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-3">
            <img src={brandImage} alt="brand" className="w-5 h-5" />
            <span className="text-emerald-500 font-semibold">
              {product.brand}
            </span>
          </div>

          <p className="text-gray-800 font-bold mb-2">
            Generic: <span className="text-emerald-500">{product.generic}</span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Price:{" "}
            <span className="text-emerald-500">৳{offerPrice.toFixed(2)}</span>{" "}
            <span className="text-sm line-through text-gray-400 ml-2">
              ৳{parseFloat(product.price).toFixed(2)}
            </span>
          </p>

          <p className="text-gray-800 font-bold mb-2">
            Dosage: <span className="text-emerald-500">{product.dosage}</span>
          </p>

          <p className="text-gray-800 font-bold mb-4">
            Form: <span className="text-emerald-500">{product.form}</span>
          </p>

          <p className="text-gray-800 font-bold mb-4">
            Stock:{" "}
            <span className="text-emerald-500">
              {product.stock_quantity > 0
                ? product.stock_quantity
                : "Out of stock"}
            </span>
          </p>

          <button
            onClick={handleAddToCart}
            className="btn bg-blue-500 hover:bg-blue-700 text-white w-full transition"
          >
            Add-To-Cart
          </button>

          <div className="mt-6">
            <p className="font-bold mb-2">Additional Offer</p>
            <AdditionalOffer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferDetails;
