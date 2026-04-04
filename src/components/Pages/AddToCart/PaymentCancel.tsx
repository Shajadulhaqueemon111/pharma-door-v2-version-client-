import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <div className="text-5xl text-red-500 mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. If you faced any issue, please try
          again or contact support.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          🔙 Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
