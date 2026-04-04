/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../privateRoute/AuthContext";
import { Typewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  medicineImage: string;
  manufactureDate: string;
  expiryDate: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  isExpired: boolean;
}

const ExpireAllMedicine = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const [expiredMedicines, setExpiredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(expiredMedicines.length / itemsPerPage);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found.");
          return;
        }
        const res = await axios.get(
          "https://pharma-door-backend.vercel.app/api/v1/medicine",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const medicines: Medicine[] = res.data.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiredByUser = medicines.filter((medicine) => {
          const expiry = new Date(medicine.expiryDate);
          expiry.setHours(0, 0, 0, 0);
          return expiry <= today && medicine.createdBy?._id === userId;
        });

        setExpiredMedicines(expiredByUser);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMedicines();
    }
  }, [userId]);

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
        const res = await axios.delete(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.status === 200) {
          toast.success("Medicine deleted successfully");
          setExpiredMedicines((prev) =>
            prev.filter((item) => item._id !== _id)
          );
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete medicine.");
      }
    }
  };

  if (loading) {
    return (
      <p className="flex justify-center mt-10">
        <ScaleLoader color="#2cabab" height={12} />
      </p>
    );
  }

  // Get current page data
  const paginatedMedicines = expiredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-red-500">
        Expired Medicines List
      </h1>

      <p className="text-lg text-blue-600 font-semibold text-center mb-4">
        <Typewriter
          words={[
            "This medicine has expired.",
            "Please do not use or sell it.",
          ]}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={50}
          deleteSpeed={0}
          delaySpeed={1000}
        />
      </p>

      {expiredMedicines.length === 0 ? (
        <p className="text-center">No expired medicines found.</p>
      ) : (
        <>
          <table className="w-full table-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Medicine-Name</th>
                <th className="border px-4 py-2">Expiry Date</th>
                <th className="border px-4 py-2">Update</th>
                <th className="border px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMedicines.map((medicine) => (
                <tr key={medicine._id}>
                  <td className="border px-4 py-2">
                    <img
                      className="h-16 w-14 object-cover"
                      src={medicine.medicineImage}
                      alt={medicine.name}
                    />
                  </td>
                  <td className="border px-4 py-2">{medicine.name}</td>
                  <td className="border px-4 py-2">
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/pharmacist-dashboard/update-expire-medicines/${medicine._id}`}
                    >
                      {" "}
                      <button className="btn btn-info">Update</button>
                    </Link>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(medicine._id)}
                      className="btn btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpireAllMedicine;
