/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateEquipment = () => {
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: 0,
    stock_quantity: 0,
    rating: 0,
    color: "",
    category: "",
    medicineImage: "",
  });

  // Load existing data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token missing");
          return;
        }

        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/equipment/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const data = res.data?.data;
        setFormData({
          name: data.name || "",
          brand: data.brand || "",
          price: data.price || 0,
          stock_quantity: data.stock_quantity || 0,
          rating: data.rating || 0,
          color: data.color || "",
          category: data.category || "",
          medicineImage: data.medicineImage || "",
        });
      } catch (err) {
        toast.error("Failed to load equipment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "medicineImage" && files) {
      const file = files[0];
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        medicineImage: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ["price", "stock_quantity", "rating"].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized! Login again.");

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("brand", formData.brand);
      form.append("category", formData.category);
      form.append("color", formData.color);
      form.append("price", formData.price.toString());
      form.append("stock_quantity", formData.stock_quantity.toString());
      form.append("rating", formData.rating.toString());

      if (imageFile) {
        form.append("medicineImage", imageFile); // send image to backend (Cloudinary)
      }

      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/equipment/${_id}`,
        form,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Equipment updated successfully!");
      navigate("/pharmacist-dashboard/all-equipment");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update equipment.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Update Equipment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "brand", "category", "color"].map((field) => (
          <div key={field}>
            <label className="block capitalize">{field}:</label>
            <input
              type="text"
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required
            />
          </div>
        ))}

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label>Stock Quantity:</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label>Rating:</label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block">Medicine Image:</label>
          <input
            type="file"
            name="medicineImage"
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
          />
          {formData.medicineImage && (
            <img
              src={formData.medicineImage}
              alt="preview"
              className="mt-2 w-40 h-40 object-cover border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateEquipment;
