import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";

const UpdatePreExpireMedicines = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [expiryDate, setExpiryDate] = useState("");
  const [oldExpiryDate, setOldExpiryDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        // const token = localStorage.getItem("accessToken");
        // if (!token) {
        //   toast.error("accessToken does not exist please login ");
        //   return;
        // }
        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`
          // {
          //   headers: {
          //     Authorization: `${token}`,
          //   },
          // }
        );
        const fetchedDate = res.data?.data?.expiryDate || "";
        setExpiryDate(fetchedDate);
        setOldExpiryDate(fetchedDate);
      } catch (error) {
        console.error("Failed to fetch medicine:", error);
        toast.error("Failed to load medicine data.");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id]);

  const getUTCDateOnly = (date: Date) => {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDate = new Date(expiryDate);
    const previousDate = new Date(oldExpiryDate);
    const today = new Date();

    const newDateUTC = getUTCDateOnly(newDate);
    const oldDateUTC = getUTCDateOnly(previousDate);
    const todayUTC = getUTCDateOnly(today);
    console.log("Old Expiry Date (raw):", oldExpiryDate);
    console.log("New Expiry Date (raw):", expiryDate);

    if (newDateUTC <= oldDateUTC) {
      toast.error("New expiry date must be greater than current expiry date.");
      return;
    }

    if (newDateUTC <= todayUTC) {
      toast.error("Expiry date cannot be today or in the past.");
      return;
    }

    const diffInDays = (newDateUTC - todayUTC) / (1000 * 60 * 60 * 24);
    if (diffInDays <= 30) {
      const confirm = window.confirm(
        `⚠️ Warning: This expiry date is only ${Math.round(
          diffInDays
        )} day(s) away. Are you sure you want to continue?`
      );
      if (!confirm) return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Access token not found. Please login.");
        return;
      }

      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        { expiryDate: new Date(expiryDate).toISOString() },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Expiry date updated successfully!");
      navigate("/pharmacist-dashboard/pre-expire-medicine");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update expiry date.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <ScaleLoader color="#2cabab" height={12} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
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
            value={expiryDate.slice(0, 10)} // YYYY-MM-DD format
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border px-4 py-2 w-full rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePreExpireMedicines;
