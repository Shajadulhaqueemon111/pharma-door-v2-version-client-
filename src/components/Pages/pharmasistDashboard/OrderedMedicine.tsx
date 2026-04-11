/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAuth } from "../privateRoute/AuthContext";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const OrderedMedicine = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?._id;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found.");
          return;
        }

        const res = await fetch(
          "https://pharma-door-backend.vercel.app/api/v1/order/ordered-medicine",
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        const data = await res.json();
        const allOrders = data?.data || [];

        // Filter orders for pharmacist's products only
        const filteredOrders = allOrders
          .map((order: any) => {
            const matchingProducts = order.products.filter(
              (item: any) => item.pharmacist === userId,
            );

            if (matchingProducts.length > 0) {
              return {
                ...order,
                products: matchingProducts,
              };
            }
            return null;
          })
          .filter((order: any) => order !== null);

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }
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
          `https://pharma-door-backend.vercel.app/api/v1/order/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        if (res.status === 200) {
          toast.success("Medicine deleted successfully");
          setOrders((prev) => prev.filter((item) => item._id !== _id));
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete medicine.");
      }
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
        Ordered Medicines (Your Medicines Only)
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          <thead>
            <tr className="bg-green-100 text-gray-800">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Medicine ID</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Pharmacist ID</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Payment</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Update</th>
              <th className="px-4 py-2 border">Delete</th>
              <th className="px-4 py-2 border">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, orderIndex) =>
              order.products.map((item: any, productIndex: number) => (
                <tr key={item._id + productIndex} className="border-b">
                  <td className="px-4 py-2 border">
                    {indexOfFirstItem + orderIndex + 1}
                  </td>
                  <td className="px-4 py-2 border">{order.user?.name}</td>
                  <td className="px-4 py-2 border">{order.user?.email}</td>
                  <td className="px-4 py-2 border">{order.user?.phone}</td>
                  <td className="px-4 py-2 border">{order.user?.address}</td>
                  <td className="px-4 py-2 border">{item.product}</td>
                  <td className="px-4 py-2 border">{item.quantity}</td>
                  <td className="px-4 py-2 border">{item.pharmacist}</td>
                  <td className="px-4 py-2 border">{order.totalPrice} TK</td>
                  <td
                    className={`px-4 py-2 border font-semibold text-white rounded 
    ${
      order.status === "Pending"
        ? "bg-yellow-500"
        : order.status === "Paid"
          ? "bg-blue-500"
          : order.status === "Shipped"
            ? "bg-indigo-500"
            : order.status === "Completed"
              ? "bg-green-600"
              : order.status === "Cancelled"
                ? "bg-red-600"
                : "bg-gray-400"
    }
           `}
                  >
                    {order.status}
                  </td>

                  <td className="px-4 py-2 border">{order.paymentStatus}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-2">
                    <Link
                      to={`/pharmacist-dashboard/update-orderd-status/${order._id}`}
                    >
                      <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-xs">
                        update
                      </button>
                    </Link>
                  </td>
                  <td className="border px-2">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      delete
                    </button>
                  </td>
                  <td className="border px-2">
                    <Link
                      to={`/pharmacist-dashboard/invoice-medicine/${order._id}`}
                    >
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs">
                        Invoice
                      </button>
                    </Link>
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderedMedicine;
