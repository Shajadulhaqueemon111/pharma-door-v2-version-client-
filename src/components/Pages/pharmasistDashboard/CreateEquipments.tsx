/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../privateRoute/AuthContext";
import { CloudUpload } from "lucide-react";

type FormValues = {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock_quantity: number;
  rating?: number;
  color: string;
  medicineImage: FileList;
};

const CreateEquipments = () => {
  const { user } = useAuth();
  const _id = user?._id;
  const name = user?.name;
  const email = user?.email;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      const imageFile = data.medicineImage[0];
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData,
        );
        imageUrl = res.data?.data?.url;
      }

      const payload = {
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: Number(data.price),
        stock_quantity: Number(data.stock_quantity),
        rating: data.rating ? Number(data.rating) : 0,
        color: data.color,
        medicineImage: imageUrl,
        createdBy: { _id: String(_id), name, email },
      };

      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/equipment/create-equipment",
        payload,
        {
          headers: { Authorization: `${token}` },
        },
      );

      if (response) {
        toast.success("Equipment created successfully!");
        reset();
        navigate("/pharmacist-dashboard/all-equipment");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create equipment",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Equipment
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter equipment name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Brand */}
        <div>
          <label className="block font-medium">Brand</label>
          <input
            type="text"
            {...register("brand", { required: "Brand is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter brand name"
          />
          {errors.brand && (
            <p className="text-red-500 text-sm">{errors.brand.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter category"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full border p-2 rounded"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block font-medium">Stock Quantity</label>
          <input
            type="number"
            {...register("stock_quantity", {
              required: "Stock quantity is required",
              min: { value: 0, message: "Stock must be positive" },
            })}
            className="w-full border p-2 rounded"
            placeholder="Enter stock quantity"
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-sm">
              {errors.stock_quantity.message}
            </p>
          )}
        </div>

        {/* Rating (optional) */}
        <div>
          <label className="block font-medium">Rating (optional)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register("rating", {
              min: { value: 0, message: "Minimum rating is 0" },
              max: { value: 5, message: "Maximum rating is 5" },
            })}
            className="w-full border p-2 rounded"
            placeholder="Enter rating (0 - 5)"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating.message}</p>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="block font-medium">Color</label>
          <input
            type="text"
            {...register("color", { required: "Color is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter color"
          />
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}
        </div>

        {/* Medicine Image */}
        <div>
          <label className="block font-medium mb-1">Equipment Image</label>
          <div className="relative w-full">
            <input
              type="file"
              accept="image/*"
              {...register("medicineImage", {
                required: "Image is required",
              })}
              className="w-full h-10 pl-10 pr-2 py-1 text-white bg-gradient-to-bl from-violet-500 to-fuchsia-500 rounded-md focus:outline-none"
            />
            <CloudUpload className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
          {errors.medicineImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.medicineImage.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateEquipments;
