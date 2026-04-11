import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ScaleLoader } from "react-spinners";

type MedicalProduct = {
  _id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock_quantity: number;
  rating: number;
  color: string;
  medicineImage: string;
};

type OutletContextType = { searchText: string };

const ITEMS_PER_PAGE = 8;

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        className="w-3 h-3"
        viewBox="0 0 12 12"
        fill={i <= rating ? "#EF9F27" : "#E2E0D8"}
      >
        <polygon points="6,0 7.4,4.1 12,4.1 8.4,6.7 9.8,10.8 6,8.3 2.2,10.8 3.6,6.7 0,4.1 4.6,4.1" />
      </svg>
    ))}
  </div>
);

const ThermometerPage = () => {
  const { searchText } = useOutletContext<OutletContextType>();
  const [medicalProducts, setMedicalProducts] = useState<MedicalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [jumpPage, setJumpPage] = useState("");

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/equipment")
      .then((res) => res.json())
      .then((data) => {
        setMedicalProducts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortBy]);

  const filtered = medicalProducts.filter((m) =>
    m.category?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "asc") return Number(a.price) - Number(b.price);
    if (sortBy === "desc") return Number(b.price) - Number(a.price);
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleJump = () => {
    const p = Number(jumpPage);
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
    setJumpPage("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader color="#185FA5" height={12} />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-800">
            Thermometer equipment
          </h1>
          <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
            {sorted.length} items
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none"
          >
            <option value="default">Sort: Default</option>
            <option value="asc">Price: Low to high</option>
            <option value="desc">Price: High to low</option>
            <option value="rating">Rating: Best first</option>
            <option value="name">Name: A–Z</option>
          </select>

          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`w-8 h-8 flex items-center justify-center transition-colors
                  ${
                    viewMode === mode
                      ? "bg-blue-50 text-blue-700"
                      : "bg-white text-gray-400 hover:bg-gray-50"
                  }`}
              >
                {mode === "grid" ? (
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                  >
                    <rect x="0" y="0" width="6" height="6" rx="1" />
                    <rect x="8" y="0" width="6" height="6" rx="1" />
                    <rect x="0" y="8" width="6" height="6" rx="1" />
                    <rect x="8" y="8" width="6" height="6" rx="1" />
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                  >
                    <rect x="0" y="0" width="14" height="3" rx="1" />
                    <rect x="0" y="5.5" width="14" height="3" rx="1" />
                    <rect x="0" y="11" width="14" height="3" rx="1" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <svg
            className="w-10 h-10 mb-3 opacity-30"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <p className="text-sm">No thermometer equipment found.</p>
        </div>
      ) : (
        <div
          data-aos="fade-up"
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          }
        >
          {paginated.map((eq) =>
            viewMode === "grid" ? (
              <div
                key={eq._id}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-blue-400 transition-colors"
              >
                <div className="relative overflow-hidden h-36 bg-blue-50">
                  <img
                    src={eq.medicineImage}
                    alt={eq.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {eq.category && (
                    <span className="absolute top-2 left-2 text-[10px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      {eq.category}
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-[11px] text-gray-400 mb-0.5">{eq.brand}</p>
                  <h2 className="text-sm font-medium text-gray-800 leading-snug mb-2 line-clamp-2">
                    {eq.name}
                  </h2>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-blue-700">
                      ৳{Number(eq.price).toLocaleString()}
                    </span>
                    {eq.rating && <StarRating rating={eq.rating} />}
                  </div>
                  <Link to={`/equipments/${eq._id}`}>
                    <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
                      View details
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={eq._id}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-blue-400 transition-colors flex gap-4 p-3"
              >
                <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-blue-50">
                  <img
                    src={eq.medicineImage}
                    alt={eq.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">
                      {eq.brand}
                    </p>
                    <h2 className="text-sm font-medium text-gray-800 mb-1">
                      {eq.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      {eq.category && (
                        <span className="text-[10px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          {eq.category}
                        </span>
                      )}
                      {eq.rating && <StarRating rating={eq.rating} />}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-base font-semibold text-blue-700">
                      ৳{Number(eq.price).toLocaleString()}
                    </span>
                    <Link to={`/equipments/${eq._id}`}>
                      <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors">
                        View details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-600">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-600">{sorted.length}</span>{" "}
            results
          </p>

          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              ‹
            </button>

            {(() => {
              const pages: (number | "...")[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("...");
                for (
                  let i = Math.max(2, currentPage - 1);
                  i <= Math.min(totalPages - 1, currentPage + 1);
                  i++
                )
                  pages.push(i);
                if (currentPage < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }
              return pages.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`e${i}`}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(Number(p))}
                    className={`w-8 h-8 rounded-lg border text-sm font-medium transition-colors
                      ${
                        currentPage === p
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {p}
                  </button>
                ),
              );
            })()}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              ›
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            Go to page
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJump()}
              className="w-12 h-7 border border-gray-200 rounded-lg text-center text-xs bg-white text-gray-700 focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleJump}
              className="px-2.5 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 text-xs hover:bg-gray-50 transition-colors"
            >
              Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThermometerPage;
