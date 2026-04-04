import { useSearchParams } from "react-router-dom";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const status = searchParams.get("status");

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">
        Payment {status === "success" ? "Successful" : "Failed"}
      </h1>
      {transactionId && <p>Transaction ID: {transactionId}</p>}
    </div>
  );
};

export default PaymentConfirmation;
