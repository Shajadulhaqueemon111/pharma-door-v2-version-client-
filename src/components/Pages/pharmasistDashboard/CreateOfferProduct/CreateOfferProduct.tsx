/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateOfferProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    generic: "",
    category: "",
    dosage: "",
    form: "",
    price: "",
    offerPercent: "",
    stock_quantity: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const nevigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (imageFile) {
      data.append("medicineImage", imageFile);
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("token does not exits please login");

        return;
      }
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/offer/create-offer",
        data,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
      toast.success("Offer product created successfully!");
      nevigate("/pharmacist-dashboard/all-offer-medicine");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create offer product.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Offer Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Brand", name: "brand", type: "text" },
          { label: "Generic", name: "generic", type: "text" },
          { label: "Category", name: "category", type: "text" },
          { label: "Dosage", name: "dosage", type: "text" },
          { label: "Form", name: "form", type: "text" },
          { label: "Price", name: "price", type: "text" },
          { label: "Offer Percent", name: "offerPercent", type: "number" },
          { label: "Stock Quantity", name: "stock_quantity", type: "number" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium mb-1" htmlFor={name}>
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1" htmlFor="medicineImage">
            Medicine Image
          </label>
          <input
            type="file"
            id="medicineImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 max-h-40 object-contain rounded"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-teal-500 text-white font-semibold py-2 rounded hover:bg-teal-600 transition"
        >
          Create Offer Product
        </button>
      </form>
    </div>
  );
};

export default CreateOfferProduct;
