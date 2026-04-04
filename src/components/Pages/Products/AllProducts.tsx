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

const ITEMS_PER_PAGE = 6;

type OutletContextType = {
  searchText: string;
};

const AllProducts = () => {
  const { searchText } = useOutletContext<OutletContextType>();

  const [allProducts, setAllProducts] = useState<AllMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/medicine")
      .then((res) => res.json())
      .then((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validMedicines = data.data.filter((item: AllMedicine) => {
          if (!item.expiryDate) return true;
          const expiryDate = new Date(item.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          return expiryDate >= today;
        });

        setAllProducts(validMedicines);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch medicines:", err);
        setLoading(false);
      });
  }, []);

  const brands = Array.from(new Set(allProducts.map((item) => item.brand)));

  // Apply filters
  const filteredProducts = allProducts
    .filter((medicine) =>
      medicine.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((medicine) =>
      selectedBrand
        ? (medicine.brand ?? "").toLowerCase().trim() ===
          selectedBrand.toLowerCase().trim()
        : true
    )
    .filter(
      (medicine) =>
        medicine.price >= priceRange[0] && medicine.price <= priceRange[1]
    );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
        All Medicines
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 bg-white p-4 rounded shadow-md space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Filter by Brand</h3>
            <select
              className="w-full border px-3 py-2 rounded"
              onChange={(e) => setSelectedBrand(e.target.value || null)}
              value={selectedBrand || ""}
            >
              <option value="">All Brands</option>
              {brands.map((brand, i) => (
                <option key={i} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                min={0}
                className="w-1/2 border px-2 py-1 rounded"
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange[1]}
                className="w-1/2 border px-2 py-1 rounded"
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedBrand(null);
              setPriceRange([0, 1000]);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 mt-4 rounded"
          >
            Reset Filters
          </button>
        </aside>

        {/* Main Product Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProducts.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No medicines found with selected filters.
            </p>
          ) : (
            paginatedProducts.map((medicine) => (
              <div
                key={medicine._id}
                className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 min-h-[320px] flex flex-col"
              >
                {/* Image with zoom effect */}
                <div className="overflow-hidden">
                  <img
                    src={medicine.medicineImage}
                    alt={medicine.name}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Card content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="space-y-1 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {medicine.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      <strong>Brand:</strong> {medicine.brand}
                    </p>
                    <p className="text-base font-bold text-green-600">
                      {medicine.price} Tk
                    </p>
                  </div>

                  <Link to={`/products/${medicine._id}`}>
                    <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-md transition-colors duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-700 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
