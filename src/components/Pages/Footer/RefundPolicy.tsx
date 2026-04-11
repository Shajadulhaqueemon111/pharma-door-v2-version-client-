const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#005E6A] mb-4">
        Refund & Return Policy
      </h1>

      <div className="bg-blue-50 p-6 rounded-xl">
        <p className="text-gray-700">
          Refunds are applicable only for damaged or incorrect products. Once
          medicine is delivered and opened, it cannot be returned due to safety
          regulations.
        </p>

        <ul className="mt-4 list-disc pl-6 text-gray-600">
          <li>Report within 24 hours</li>
          <li>Provide order ID</li>
          <li>Attach product image</li>
        </ul>
      </div>
    </div>
  );
};

export default RefundPolicy;
