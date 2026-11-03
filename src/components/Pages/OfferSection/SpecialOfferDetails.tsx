import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import brandImage from "../../../assets/brand1.png";
import AdditionalOffer from "../OtcMedicine/AdditionalOffer";
import SafetyAdvice from "../OtcMedicine/SafetyAdvice";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";
import { ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle, ChevronRight, Flame, Truck } from "lucide-react";

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
          "https://pharmadoor-backend-v2.vercel.app/api/v1/offer",
        );
        const found = response.data.data.find(
          (item: OfferProduct) => item._id === _id,
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <ScaleLoader color="#0d9488" height={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-rose-600 font-semibold">
        Special offer product not found.
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
    toast.success(`Added ${product.name} with discount to cart!`);
    const updatedCart = [...existingCart, productWithModel];
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const inStock = product.stock_quantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link to="/" className="hover:text-teal-600 transition">
          Home
        </Link>
        <ChevronRight size={13} />
        <Link to="/products/all-products" className="hover:text-teal-600 transition">
          Special Deals
        </Link>
        <ChevronRight size={13} />
        <span className="text-slate-700 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image & Safety Advice */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-center justify-center relative overflow-hidden">
            {/* Offer Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-extrabold shadow-sm">
              <Flame size={14} className="fill-white" />
              <span>{product.offerPercent}% OFF</span>
            </div>

            <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-800 rounded-full text-[10px] font-bold border border-teal-200/60">
              <ShieldCheck size={12} className="text-teal-600" />
              <span>Verified Authentic</span>
            </div>

            <img
              src={product.medicineImage}
              alt={product.name}
              className="max-h-72 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          <SafetyAdvice />
        </div>

        {/* Right Column: Info & Action */}
        <div className="lg:col-span-7 space-y-6">
          {/* Wholesale Notice */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-xs sm:text-sm font-bold text-teal-200">
                ব্যবসার জন্য পাইকারি দামে পণ্য কিনতে চান?
              </p>
              <p className="text-[11px] text-slate-300">
                রেজিস্টার্ড ফার্মাসিস্ট হিসেবে বিশেষ রেটে মেডিসিন ক্রয় করুন।
              </p>
            </div>
            <Link
              to="/register"
              className="px-4 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition"
            >
              ফার্মাসিস্ট রেজিস্ট্রেশন
            </Link>
          </div>

          {/* Product Info Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            {/* Brand & Stock */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <img src={brandImage} alt="Brand" className="w-5 h-5 object-contain" />
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>
                {product.generic && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                    {product.generic}
                  </span>
                )}
              </div>

              {inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={13} />
                  In Stock ({product.stock_quantity})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                  <AlertCircle size={13} />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-slate-50 border border-teal-200/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-teal-800 block font-bold uppercase tracking-wider mb-0.5">
                  Promotional Deal Price
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-teal-700">
                    ৳{offerPrice.toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-slate-400 font-medium">
                    ৳{parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    Save {product.offerPercent}%
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-white px-3 py-1.5 rounded-xl shadow-2xs">
                <Truck size={14} />
                <span>Express 2-Hr Delivery</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Form</span>
                <span className="font-bold text-slate-800">{product.form || "Standard"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Dosage</span>
                <span className="font-bold text-slate-800">{product.dosage || "As prescribed"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Available Stock</span>
                <span className="font-bold text-slate-800">{product.stock_quantity} units</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                <span>{inStock ? "Add to Cart With Special Discount" : "Currently Out of Stock"}</span>
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

export default SpecialOfferDetails;
