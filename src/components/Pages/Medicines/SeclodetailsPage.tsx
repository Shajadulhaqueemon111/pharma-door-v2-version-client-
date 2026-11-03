import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import brandImage from "../../../assets/brand1.png";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import { ShoppingBag, ShieldCheck, CheckCircle2, ChevronRight, Truck } from "lucide-react";

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
    fetch("https://pharmadoor-backend-v2.vercel.app/api/v1/medicine")
      .then((res) => res.json())
      .then((resData) => {
        const found = (resData?.data || []).find(
          (item: SecloMedicine) => item._id === _id,
        );
        setMedicine(found || null);
      })
      .catch((err) => console.error("Failed to load details:", err));
  }, [_id]);

  if (!medicine) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ScaleLoader color="#0d9488" height={32} />
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    toast.success(`Added ${medicine.name} to cart!`);
    const updatedCart = [...existingCart, medicine];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link to="/" className="hover:text-teal-600 transition">
          Home
        </Link>
        <ChevronRight size={13} />
        <Link to="/medicines/seclo" className="hover:text-teal-600 transition">
          Seclo Series
        </Link>
        <ChevronRight size={13} />
        <span className="text-slate-700 font-semibold truncate max-w-xs">
          {medicine.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image showcase & Safety Advice */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-800 rounded-full text-[10px] font-bold border border-teal-200/60">
              <ShieldCheck size={12} className="text-teal-600" />
              <span>100% Genuine Square</span>
            </div>

            <img
              src={medicine.medicineImage}
              alt={medicine.name}
              className="max-h-72 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          <SafetyAdvice />
        </div>

        {/* Right Column: Pricing, Buy, Wholesale */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wholesale Notice */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-xs sm:text-sm font-bold text-teal-200">
                ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চান?
              </p>
              <p className="text-[11px] text-slate-300">
                রেজিস্টার্ড ফার্মাসিস্ট হিসেবে বিশেষ পাইকারি মূল্যে অর্ডার করুন।
              </p>
            </div>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition"
            >
              রেজিস্ট্রেশন
            </Link>
          </div>

          {/* Product Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <img src={brandImage} alt="Brand" className="w-5 h-5 object-contain" />
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  {medicine.brand}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={13} />
                In Stock ({medicine.stock} units)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {medicine.name}
            </h1>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">
                  Retail Price (MRP)
                </span>
                <span className="text-3xl font-extrabold text-teal-700">
                  ৳{medicine.price}
                </span>
                <span className="text-xs text-slate-500 ml-1.5">
                  / Unit (VAT Included)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                <Truck size={14} />
                <span>Fast 2-Hr Delivery</span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Manufacturer</span>
                <span className="font-bold text-slate-800">{medicine.brand}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Inventory Status</span>
                <span className="font-bold text-slate-800">{medicine.stock} units available</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>Add to Shopping Cart</span>
              </button>
            </div>

            {/* Offers */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Eligible Bank & Pharmacy Offers
              </p>
              <AdditionalOffer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeclodetailsPage;
