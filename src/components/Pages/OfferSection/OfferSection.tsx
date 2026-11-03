/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Flame, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

interface OfferMedicine {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  offerPercent: number;
  medicineImage: string;
  stock_quantity: number;
}

type OutletContextType = {
  searchText: string;
};

const OfferSection = () => {
  const [medicineoffers, setMedicineOffers] = useState<OfferMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchText } = useOutletContext<OutletContextType>();

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 6;

  const fetchOfferMedicine = async () => {
    setLoading(true);
    try {
      const response = await axios(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/offer",
      );
      setMedicineOffers(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferMedicine();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <ScaleLoader color="#0d9488" height={32} />
      </div>
    );
  }

  if (!medicineoffers.length) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        No offer medicines available right now.
      </div>
    );
  }

  // filter
  const filterOfferProduct = medicineoffers.filter((offers) =>
    offers.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // pagination
  const totalItems = filterOfferProduct.length;
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;

  const currentItems = filterOfferProduct.slice(
    startIndex,
    startIndex + itemPerPage,
  );

  return (
    <section className="py-10 sm:py-14 bg-slate-50/70 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 text-xs font-bold mb-2">
              <Flame size={14} className="text-rose-500 fill-rose-500" />
              <span>Limited Time Deals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Special Discount Offers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Save more on doctor-recommended essential drugs & health supplements
            </p>
          </div>

          <Link
            to="/products/all-products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 transition"
          >
            <span>View All Products</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((product) => {
            const offerPrice =
              parseFloat(product.price) -
              (parseFloat(product.price) * product.offerPercent) / 100;

            const isAvailable = product.stock_quantity > 0;

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Image Container with Badges */}
                <div className="relative bg-slate-50/60 p-5 flex items-center justify-center h-52 overflow-hidden border-b border-slate-100">
                  <img
                    alt={product.name}
                    src={product.medicineImage}
                    className="max-h-44 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
                    {product.offerPercent}% OFF
                  </div>

                  {/* Stock Pill */}
                  <div className="absolute top-3 right-3">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        In Stock ({product.stock_quantity})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        <AlertCircle size={11} />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Brand & Form pill */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {product.brand}
                      </span>
                      {product.form && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {product.form}
                        </span>
                      )}
                      {product.dosage && (
                        <span className="text-[11px] font-medium text-slate-500">
                          {product.dosage}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {product.generic && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        Generic: {product.generic}
                      </p>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        Special Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-teal-700">
                          ৳{offerPrice.toFixed(2)}
                        </span>
                        <span className="text-xs line-through text-slate-400 font-medium">
                          ৳{parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/medicines/specialoffer/${product._id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 400, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OfferSection;
