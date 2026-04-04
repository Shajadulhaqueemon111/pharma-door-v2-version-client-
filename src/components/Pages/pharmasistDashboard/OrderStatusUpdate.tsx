/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const OrderStatusUpdate = () => {
  const { _id } = useParams();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const nevigate = useNavigate();
  const handleStatusUpdate = async () => {
    if (!status) {
      toast.error("Please select a status.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("does not accessToke your localStorage");
      }
      const response = await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/order/${_id}`,
        { status },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Status updated successfully!");
        nevigate("/pharmacist-dashboard/orderd-medicine");
      } else {
        console.log("Failed to update status.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Order Status Update</h2>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">Select status</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Shipped">Shipped</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button
        onClick={handleStatusUpdate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
};

export default OrderStatusUpdate;
