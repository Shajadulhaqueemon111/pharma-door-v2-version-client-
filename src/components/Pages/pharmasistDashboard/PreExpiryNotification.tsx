/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useAuth } from "../privateRoute/AuthContext";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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

const PreExpiryNotification: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { user } = useAuth();
  const userId = user?._id;
  console.log("Logged in user ID:", userId);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return console.error("No access token found.");

      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/medicine",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log(res);
      const data: Medicine[] = res.data?.data || [];
      console.log(data);
      console.log("Fetched data:", data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);
      thirtyDaysLater.setHours(23, 59, 59, 999);

      const preExpiring = data.filter((medicine) => {
        const expiry = new Date(medicine.expiryDate);
        return (
          expiry.getTime() > today.getTime() &&
          expiry.getTime() <= thirtyDaysLater.getTime() &&
          medicine.createdBy?._id === userId
        );
      });
      console.log(preExpiring);
      setMedicines(preExpiring);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    } finally {
      setLoading(false);
    }
  };

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
          setMedicines((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete medicine.");
      }
    }
  };

  useEffect(() => {
    if (userId) fetchMedicines();
  }, [userId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(medicines.length / itemsPerPage);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded border text-sm ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700"
          } hover:bg-blue-100 transition`}
        >
          {i}
        </button>
      );
    }

    return <div className="flex justify-center mt-6 space-x-2">{pages}</div>;
  };

  if (!userId) return <p>Please login to see your medicine alerts.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <p className="text-lg text-blue-600 font-semibold text-center mb-6">
        <Typewriter
          words={["⚠️ Medicines Expiring in 30 Days"]}
          loop={false}
          cursor
          cursorStyle="_"
          typeSpeed={50}
          deleteSpeed={0}
          delaySpeed={1000}
        />
      </p>

      {medicines.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          <p className="text-lg font-medium">
            No medicines found expiring in the next 30 days.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gradient-to-r from-blue-200 to-blue-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Image
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Name
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Price
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Expiry Date
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentMedicines.map((medicine) => {
                  const expiryZoned = toZonedTime(
                    medicine.expiryDate,
                    userTimeZone
                  );
                  return (
                    <tr
                      key={medicine._id}
                      className="hover:bg-blue-50 transition duration-200"
                    >
                      <td className="px-4 py-2">
                        <img
                          src={medicine.medicineImage}
                          alt={medicine.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm">{medicine.name}</td>
                      <td className="px-4 py-2 text-sm">{medicine.brand}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-700">
                        ${medicine.price}
                      </td>
                      <td className="px-4 py-2 text-sm">{medicine.stock}</td>
                      <td className="px-4 py-2 text-sm text-red-600 font-semibold">
                        {format(expiryZoned, "PPP")}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <Link
                          to={`/pharmacist-dashboard/update-pre-expire-medicine/${medicine._id}`}
                        >
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">
                            Update
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(medicine._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default PreExpiryNotification;
