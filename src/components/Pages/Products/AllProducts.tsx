import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

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

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/medicine")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const valid = data.data.filter((item: AllMedicine) => {
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

  const brands = Array.from(new Set(allProducts.map((m) => m.brand)));
  const brandCounts = brands.reduce(
    (acc, b) => {
      acc[b] = allProducts.filter((m) => m.brand === b).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  let filtered = allProducts
    .filter((m) => m.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter((m) =>
      selectedBrand ? m.brand?.trim() === selectedBrand.trim() : true,
    )
    .filter((m) => m.price <= maxPrice)
    .filter((m) => {
      if (stockFilter === "in") return Number(m.stock) > 0;
      if (stockFilter === "out") return Number(m.stock) === 0;
      return true;
    });

  if (sortBy === "asc")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "desc")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
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
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader color="#185FA5" height={12} />
      </div>
    );
  }

  return (
    <div className="flex gap-6 px-6 py-8 bg-gray-50 min-h-screen">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col gap-4">
        {/* Brand filter */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
            Brand
          </p>
          <ul className="space-y-1">
            <li
              onClick={() => {
                setSelectedBrand(null);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors
                ${!selectedBrand ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${!selectedBrand ? "bg-blue-600" : "bg-gray-300"}`}
              />
              All Brands
              <span className="ml-auto text-[11px] text-gray-400">
                {allProducts.length}
              </span>
            </li>
            {brands.map((brand) => (
              <li
                key={brand}
                onClick={() => {
                  setSelectedBrand(brand);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm transition-colors
                  ${selectedBrand === brand ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${selectedBrand === brand ? "bg-blue-600" : "bg-gray-300"}`}
                />
                {brand}
                <span className="ml-auto text-[11px] text-gray-400">
                  {brandCounts[brand]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price range */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
            Price range
          </p>
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
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>৳0</span>
            <span className="font-medium text-gray-700">Max ৳{maxPrice}</span>
            <span>৳1000</span>
          </div>
        </div>

        {/* Stock filter */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
            Availability
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {(["all", "in", "out"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setStockFilter(opt);
                  setCurrentPage(1);
                }}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-colors
                  ${
                    stockFilter === opt
                      ? "bg-blue-50 border-blue-400 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {opt === "all" ? "All" : opt === "in" ? "In stock" : "Out"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          ↺ Reset filters
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-700">{filtered.length}</span>{" "}
            medicines
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none"
          >
            <option value="default">Sort: Default</option>
            <option value="asc">Price: Low to high</option>
            <option value="desc">Price: High to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-20 text-sm">
              No medicines match the selected filters.
            </p>
          ) : (
            paginated.map((medicine) => (
              <div
                key={medicine._id}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-blue-400 transition-colors"
              >
                <div className="overflow-hidden h-36 bg-gray-50">
                  <img
                    src={medicine.medicineImage}
                    alt={medicine.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] text-gray-400 mb-0.5">
                    {medicine.brand}
                  </p>
                  <h2 className="text-sm font-medium text-gray-800 mb-3 leading-snug">
                    {medicine.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-blue-700">
                      ৳{medicine.price}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                      ${Number(medicine.stock) > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
                    >
                      {Number(medicine.stock) > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <Link to={`/products/${medicine._id}`}>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                      View details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1.5 pt-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg border text-sm font-medium transition-colors
                  ${
                    currentPage === i + 1
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
