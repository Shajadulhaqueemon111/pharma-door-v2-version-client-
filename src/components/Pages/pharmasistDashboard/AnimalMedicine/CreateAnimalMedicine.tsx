/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { CloudUpload } from "lucide-react";
import { useAuth } from "../../privateRoute/AuthContext";

type FormValues = {
  name: string;
  category: string;
  price: string; // send as string
  stock: string; // required by backend
  medicineImage: FileList;
};

const CreateAnimalMedicine = () => {
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
          formData
        );
        imageUrl = res.data?.data?.url;
      }

      // Correct payload
      const payload = {
        name: data.name,
        category: data.category,
        price: data.price, // already string
        stock: data.stock, // must send
        medicineImage: imageUrl,
        createdBy: { _id: String(_id), name, email },
      };

      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/animal-medicine/create-animalmedicine",
        payload,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (response.data) {
        toast.success("Animal medicine created successfully!");
        reset();
        navigate("/pharmacist-dashboard/All-animal-medicine");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create animal medicine"
      );
      console.error("Error response:", error?.response?.data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Animal Medicine
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter medicine name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
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
            type="text"
            {...register("price", { required: "Price is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="text"
            {...register("stock", { required: "Stock is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter stock quantity"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock.message}</p>
          )}
        </div>

        {/* Medicine Image */}
        <div>
          <label className="block font-medium mb-1">Medicine Image</label>
          <div className="relative w-full">
            <input
              type="file"
              accept="image/*"
              {...register("medicineImage", { required: "Image is required" })}
              className="w-full h-10 pl-10 pr-2 py-1 rounded-md border"
            />
            <CloudUpload className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
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

export default CreateAnimalMedicine;
