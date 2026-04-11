/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
type OfferProduct = {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  medicineImage: string;
  offerPercent: string;
  stock_quantity: string;
};

const AllOfferProducts = () => {
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;
  const fetchOfferProduct = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/offer",
      );
      console.log(response);
      setOfferProducts(response.data.data);
    } catch (err) {
      console.log(err);
      toast.error("failed retrive offer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferProduct();
  }, []);
  const handleDelete = async (_id: any) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("accessToken does not exist");
        }
        const response = await axios.delete(
          `https://pharma-door-backend.vercel.app/api/v1/offer/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        if (response.status === 200 || response.status === 204) {
          toast.success("offerproduct deleted successfully");
          setOfferProducts((prev) => prev.filter((prod) => prod._id !== _id));
        } else {
          toast.error("Failed to delete offer product");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }

  const totalItems = offerProducts.length;
  const totalPage = Math.ceil(totalItems / itemPerPage);

  const startIndex = (currentPage - 1) * itemPerPage;
  const currentItems = offerProducts.slice(
    startIndex,
    startIndex + itemPerPage,
  );
  const gotToPage = (page: any) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Offer Products</h2>

      {/* Scrollable container for responsiveness */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Brand</th>
              <th className="border px-3 py-2">Generic</th>
              <th className="border px-3 py-2">Category</th>
              <th className="border px-3 py-2">Dosage</th>
              <th className="border px-3 py-2">Form</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Offer %</th>
              <th className="border px-3 py-2">Stock</th>
              <th className="border px-3 py-2">Update</th>
              <th className="border px-3 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((prod) => (
              <tr key={prod._id} className="text-center">
                <td className="border px-3 py-2">
                  <img
                    src={prod.medicineImage}
                    alt={prod.name}
                    className="h-12 w-auto mx-auto object-contain"
                  />
                </td>
                <td className="border px-3 py-2">{prod.name}</td>
                <td className="border px-3 py-2">{prod.brand}</td>
                <td className="border px-3 py-2">{prod.generic}</td>
                <td className="border px-3 py-2">{prod.category}</td>
                <td className="border px-3 py-2">{prod.dosage}</td>
                <td className="border px-3 py-2">{prod.form}</td>
                <td className="border px-3 py-2">{prod.price}</td>
                <td className="border px-3 py-2">{prod.offerPercent}%</td>
                <td className="border px-3 py-2">{prod.stock_quantity}</td>
                <td className="border px-3 py-2">
                  <Link
                    to={`/pharmacist-dashboard/update-offer-page/${prod._id}`}
                  >
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs md:text-sm">
                      Update
                    </button>
                  </Link>
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs md:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {offerProducts.length === 0 && (
              <tr>
                <td colSpan={12} className="py-4 text-center text-gray-500">
                  No offer products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
        <button
          onClick={() => gotToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPage)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => gotToPage(page)}
              className={`px-3 py-1 rounded text-sm md:text-base ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => gotToPage(currentPage + 1)}
          disabled={currentPage === totalPage}
          className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllOfferProducts;
