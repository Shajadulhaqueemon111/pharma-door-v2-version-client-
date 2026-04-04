import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";

const UpdateExpireMedicines = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [expiryDate, setExpireDate] = useState("");
  const [oldExpiryDate, setOldExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`
        );
        const dbDate = res.data?.data?.expiryDate || "";
        setExpireDate(dbDate);
        setOldExpiryDate(dbDate);
      } catch (err) {
        console.error("Failed to fetch medicine:", err);
        toast.error("Failed to fetch medicine");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDateStr = expiryDate.slice(0, 10);
    const oldDateStr = oldExpiryDate.slice(0, 10);

    console.log("New Date:", newDateStr);
    console.log("Old DB Date:", oldDateStr);

    if (newDateStr <= oldDateStr) {
      toast.error("New expiry date must be greater than current expiry date.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Access token not found. Please login first.");
        return;
      }

      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        { expiryDate: new Date(expiryDate).toISOString() },
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Expiry date updated successfully!");
      navigate("/pharmacist-dashboard/expire-medicines");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update expiry date.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10">
        <ScaleLoader color="#2cabab" height={12} />
      </p>
    );

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600 text-center">
        Update Expiry Date
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expireDate" className="block mb-1 font-medium">
            Expiry Date:
          </label>
          <input
            type="date"
            id="expireDate"
            value={expiryDate.slice(0, 10)}
            onChange={(e) => setExpireDate(e.target.value)}
            className="border px-4 py-2 w-full rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateExpireMedicines;
