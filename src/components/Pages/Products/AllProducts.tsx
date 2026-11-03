import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Filter, RotateCcw, ArrowRight, CheckCircle2, AlertCircle, SlidersHorizontal } from "lucide-react";

type AllMedicine = {
  _id: string;
  name: string;
  brand: string;
  stock: string;
  price: number;
  medicineImage: string;
  expiryDate?: string;
};

const ITEMS_PER_PAGE = 9;

type OutletContextType = { searchText: string };

const AllProducts = () => {
  const { searchText } = useOutletContext<OutletContextType>();
  const [allProducts, setAllProducts] = useState<AllMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [stockFilter, setStockFilter] = useState<"all" | "in" | "out">("all");
  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch("https://pharmadoor-backend-v2.vercel.app/api/v1/medicine")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const valid = (data.data || []).filter((item: AllMedicine) => {
          if (!item.expiryDate) return true;
          const exp = new Date(item.expiryDate);
          exp.setHours(0, 0, 0, 0);
          return exp >= today;
        });
        setAllProducts(valid);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const brands = Array.from(new Set(allProducts.map((m) => m.brand).filter(Boolean)));
  const brandCounts = brands.reduce(
    (acc, b) => {
      acc[b] = allProducts.filter((m) => m.brand === b).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  let filtered = allProducts
    .filter((m) => (m.name || "").toLowerCase().includes((searchText || "").toLowerCase()))
    .filter((m) =>
      selectedBrand ? m.brand?.trim() === selectedBrand.trim() : true,
    )
    .filter((m) => Number(m.price) <= maxPrice)
    .filter((m) => {
      if (stockFilter === "in") return Number(m.stock) > 0;
      if (stockFilter === "out") return Number(m.stock) === 0;
      return true;
    });

  if (sortBy === "asc")
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === "desc")
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  if (sortBy === "name")
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const resetFilters = () => {
    setSelectedBrand(null);
    setMaxPrice(1000);
    setStockFilter("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ScaleLoader color="#0d9488" height={30} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Heading */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Genuine Medicines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our comprehensive inventory of hospital & pharmacy certified medicines
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer self-start"
        >
          <SlidersHorizontal size={15} className="text-teal-600" />
          <span>{mobileFilterOpen ? "Hide Filters" : "Filter Medicines"}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Sidebar Filters ── */}
        <aside
          className={`w-full lg:w-64 shrink-0 flex flex-col gap-5 ${
            mobileFilterOpen ? "block" : "hidden lg:flex"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Filter size={15} className="text-teal-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Brand Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Pharmaceutical Brand
            </p>
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              <div
                onClick={() => {
                  setSelectedBrand(null);
                  setCurrentPage(1);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  !selectedBrand
                    ? "bg-teal-50 text-teal-800 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Brands</span>
                <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {allProducts.length}
                </span>
              </div>
              {brands.map((brand) => (
                <div
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                    selectedBrand === brand
                      ? "bg-teal-50 text-teal-800 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate mr-2">{brand}</span>
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0">
                    {brandCounts[brand]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Max Price
              </p>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                ৳{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>৳0</span>
              <span>৳1,000</span>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Stock Status
            </p>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              {(["all", "in", "out"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setStockFilter(opt);
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    stockFilter === opt
                      ? "bg-white text-teal-800 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {opt === "all" ? "All" : opt === "in" ? "In Stock" : "Out"}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Medicines View ── */}
        <div className="flex-1 w-full flex flex-col gap-5">
          {/* Controls Bar */}
          <div className="bg-white p-3 sm:px-4 sm:py-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-500">
              Showing{" "}
              <span className="font-extrabold text-slate-800">{filtered.length}</span>{" "}
              medicines found
              {selectedBrand && (
                <span className="ml-1 text-teal-700 font-semibold">
                  in {selectedBrand}
                </span>
              )}
            </p>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="default">Default Relevance</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-100">
                <p className="text-base font-bold text-slate-700">
                  No medicines match your search filters
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting the price range or clearing brand selections.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              paginated.map((medicine) => {
                const inStock = Number(medicine.stock) > 0;

                return (
                  <div
                    key={medicine._id}
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image Area */}
                      <div className="relative bg-slate-50 p-4 h-48 flex items-center justify-center overflow-hidden border-b border-slate-100">
                        <img
                          src={medicine.medicineImage}
                          alt={medicine.name}
                          className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Stock badge */}
                        <div className="absolute top-3 right-3">
                          {inStock ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} />
                              In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              <AlertCircle size={11} />
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                          {medicine.brand}
                        </span>

                        <h2 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                          {medicine.name}
                        </h2>

                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-base font-extrabold text-teal-700">
                            ৳{medicine.price}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Stock: {medicine.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 pt-0">
                      <Link
                        to={`/products/${medicine._id}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 group-hover:bg-teal-600 text-white text-xs font-semibold transition-all shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
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
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
