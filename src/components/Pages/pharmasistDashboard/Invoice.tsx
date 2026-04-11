/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

const Invoice = () => {
  const { _id } = useParams<{ _id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || !_id) return;

      try {
        const res = await fetch(
          `https://pharma-door-backend.vercel.app/api/v1/order/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        const data = await res.json();

        setOrder(data?.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [_id]);

  if (loading)
    return (
      <p className="text-center mt-10">
        <ScaleLoader color="#2cabab" height={12} /> Loading invoice...
      </p>
    );
  if (!order)
    return <p className="text-center mt-10 text-red-500"> Order not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg print:p-0 print:shadow-none">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        Invoice
      </h2>

      <div className="mb-6 text-sm space-y-1">
        <p>
          <strong>Customer:</strong> {order.user?.name}
        </p>
        <p>
          <strong>Email:</strong> {order.user?.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.user?.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.user?.address}
        </p>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>TransactionId:</strong> {order.transactionId}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <table className="w-full text-sm border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Medicine ID</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Pharmacist ID</th>
          </tr>
        </thead>
        <tbody>
          {order.products?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="border px-2 py-1 text-center">{item.product}</td>
              <td className="border px-2 py-1 text-center">{item.quantity}</td>
              <td className="border px-2 py-1 text-center">
                {item.pharmacist}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1 text-sm">
        <p>
          <strong>Total Price:</strong> {order.totalPrice} TK
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentStatus}
        </p>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-8 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 block mx-auto print:hidden"
      >
        🖨️ Print Invoice
      </button>
    </div>
  );
};

export default Invoice;
