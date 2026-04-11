/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
type Medicine = {
  _id: number;
  name: string;
  category: string;
  description: string;
  medicineImage: string;
};

const PrescriptionUpload = () => {
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPrescriptionFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSearchMedicines = async () => {
    if (!prescriptionFile) {
      toast.error("Please upload your prescription first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("prescription", prescriptionFile);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No access token in localStorage");
        return;
      }

      const response = await fetch(
        "https://pharma-door-backend.vercel.app/api/v1/medicine/prescription",
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        },
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch medicines");
      }

      const data = await response.json();
      console.log(data);
      setMedicines(data.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Upload Your Prescription
      </h2>

      <label
        htmlFor="prescriptionInput"
        className="block mb-4 text-gray-700 font-medium cursor-pointer border-2 border-dashed border-gray-300 rounded-lg py-12 text-center hover:border-indigo-500 transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Prescription Preview"
            className="mx-auto max-h-48 object-contain rounded"
          />
        ) : (
          <span className="text-gray-400">
            Click to select prescription image or PDF
          </span>
        )}
      </label>

      <input
        id="prescriptionInput"
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleSearchMedicines}
        disabled={loading}
        className={`w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded shadow transition ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Searching..." : "Search Medicines"}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {medicines.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Medicines Found:</h3>

          <ul className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {medicines.map((med) => (
              <motion.li
                key={med._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl"
              >
                <Link
                  to={`/prescription-medicine-details/${med._id}`}
                  className="block"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={med.medicineImage}
                      alt={med.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold text-indigo-700 truncate">
                      {med.name}
                    </h4>
                    <p className="text-sm text-gray-500">{med.category}</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {med.description}
                    </p>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : (
        prescriptionFile &&
        !loading && (
          <p className="mt-8 text-center text-red-500 font-semibold">
            No medicines matched in the prescription.
          </p>
        )
      )}
    </div>
  );
};

export default PrescriptionUpload;
