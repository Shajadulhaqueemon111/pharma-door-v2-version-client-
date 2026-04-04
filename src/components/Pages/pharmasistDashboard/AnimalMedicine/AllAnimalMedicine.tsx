/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useAuth } from "../../privateRoute/AuthContext";

interface Medicine {
  _id: string;
  name: string;
  brand?: string;
  category: string;
  price: string;
  stock: string;
  medicineImage: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  isExpired: boolean;
}

const ITEMS_PER_PAGE = 5;

const AllAnimalMedicinePage = () => {
  const [medicine, setMedicine] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const userId = user?._id;

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/animal-medicine",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const allMedicines = response.data.data;
        const userMedicines = allMedicines.filter(
          (med: any) => med?.createdBy?._id === userId
        );

        setMedicine(userMedicines);
      } catch (error) {
        console.error("Error fetching medicine:", error);
        toast.error("Failed to fetch medicines");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMedicine();
    }
  }, [userId]);

  const totalPages = Math.ceil(medicine.length / ITEMS_PER_PAGE);
  const paginatedMedicine = medicine.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (_id: string) => {
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
          toast.error("Token not found in localStorage");
          return;
        }

        const res = await axios.delete(
          `https://pharma-door-backend.vercel.app/api/v1/animal-medicine/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.status === 200) {
          toast.success("Medicine deleted successfully");
          setMedicine((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete medicine");
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Animal Medicines
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>

              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Delete</th>
              <th className="py-3 px-4 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicine.map((product) => (
              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">
                  <img
                    src={product.medicineImage}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2 px-4">{product.name}</td>

                <td className="py-2 px-4">{product.category}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4">{product.stock}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-white bg-red-500 p-2 border-0 cursor-pointer rounded"
                  >
                    Delete
                  </button>
                </td>
                <td className="py-2 px-4">
                  <Link
                    to={`/pharmacist-dashboard/update-animal-medicine/${product._id}`}
                  >
                    <button className="text-white bg-blue-500 p-2 border-0 cursor-pointer rounded">
                      Update
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center space-x-2">
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

export default AllAnimalMedicinePage;
