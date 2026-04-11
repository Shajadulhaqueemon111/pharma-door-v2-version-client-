/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { CloudUpload } from "lucide-react";

type FormValues = {
  name: string;
  category: string;
  price: string;
  stock: string;
  medicineImage: FileList | null;
};

const UpdateAnimalMedicine = () => {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const [existingImage, setExistingImage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const watchImage = watch("medicineImage");

  // Fetch existing data
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/animal-medicine/${_id}`,
          {
            headers: { Authorization: `${token}` },
          },
        );

        const data = res.data.data || res.data;
        setValue("name", data.name);
        setValue("category", data.category);
        setValue("price", data.price);
        setValue("stock", data.stock);
        setExistingImage(data.medicineImage);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch animal medicine data");
      }
    };

    fetchMedicine();
  }, [_id, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      let imageUrl = existingImage;

      // Upload new image if selected
      if (data.medicineImage && data.medicineImage.length > 0) {
        const imageFile = data.medicineImage[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData,
        );
        imageUrl = res.data?.data?.url;
      }

      // Only update relevant fields
      const payload: any = {
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
      };

      if (imageUrl) {
        payload.medicineImage = imageUrl;
      }

      const token = localStorage.getItem("accessToken");

      const response = await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/animal-medicine/${_id}`,
        payload,
        { headers: { Authorization: `${token}` } },
      );

      if (response.data) {
        toast.success("Animal medicine updated successfully!");
        navigate("/pharmacist-dashboard/All-animal-medicine");
      }
    } catch (error: any) {
      console.error(error?.response?.data);
      toast.error(
        error?.response?.data?.message || "Failed to update animal medicine",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Animal Medicine
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
              {...register("medicineImage")}
              className="w-full h-10 pl-10 pr-2 py-1 rounded-md border"
            />
            <CloudUpload className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Current Image:</p>
            {watchImage && watchImage.length > 0 ? (
              <img
                src={URL.createObjectURL(watchImage[0])}
                alt="Preview"
                className="h-32 mt-1 rounded"
              />
            ) : existingImage ? (
              <img
                src={existingImage}
                alt="Current"
                className="h-32 mt-1 rounded"
              />
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateAnimalMedicine;
