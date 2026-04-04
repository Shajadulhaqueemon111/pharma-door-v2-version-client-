/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
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
        "https://pharma-door-backend.vercel.app/api/v1/offer"
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
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }
  if (!medicineoffers.length) {
    return <div className="text-center">No Offer Medicine</div>;
  }
  const filterOfferProduct = medicineoffers.filter((offers) =>
    offers.name.toLowerCase().includes(searchText.toLowerCase())
  );
  //pagination
  const totalItems = filterOfferProduct.length;
  const totalPage = Math.ceil(totalItems / itemPerPage);
  //slice the current page
  const startIndex = (currentPage - 1) * itemPerPage;
  const currentItems = filterOfferProduct.slice(
    startIndex,
    startIndex + itemPerPage
  );
  const gotToPage = (page: any) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
    window.scroll({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      <section className="bg-gray-50 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
            Special Offers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentItems.map((product) => {
              const offerPrice =
                parseFloat(product.price) -
                (parseFloat(product.price) * product.offerPercent) / 100;

              return (
                <div
                  key={product._id}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg z-10 select-none">
                    {product.offerPercent}% OFF
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden rounded-t-2xl">
                    <img
                      src={product.medicineImage}
                      alt={product.name}
                      className="w-full h-36 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      Brand: {product.brand} | {product.form} | {product.dosage}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Stock:{" "}
                      <span
                        className={
                          product.stock_quantity > 0
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {product.stock_quantity > 0
                          ? product.stock_quantity
                          : "Out of Stock"}
                      </span>
                    </p>

                    <div className="mt-auto flex items-center gap-3">
                      <span className="text-xl font-bold text-green-700">
                        ৳{offerPrice.toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-gray-400">
                        ৳{parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>

                    <a
                      href={`/medicines/specialoffer/${product._id}`}
                      className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2 rounded-xl shadow-md transition"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-12 space-x-3">
          <button
            onClick={() => gotToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition"
          >
            Prev
          </button>

          {[...Array(totalPage)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => gotToPage(page)}
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  currentPage === page
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => gotToPage(currentPage + 1)}
            disabled={currentPage === totalPage}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default OfferSection;
