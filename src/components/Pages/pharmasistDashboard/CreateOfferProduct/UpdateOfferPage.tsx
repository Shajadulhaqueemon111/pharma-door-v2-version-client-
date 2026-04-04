/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

type OfferProduct = {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  medicineImage: string;
  offerPercent: string;
  stock_quantity: string;
};

const UpdateOfferPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<OfferProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/offer/${_id}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (product) {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/offer/${_id}`,
        product,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Product updated successfully!");
        navigate("/pharmacist-dashboard/all-offer-medicine");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  if (loading || !product) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Update Offer Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          "name",
          "brand",
          "generic",
          "category",
          "dosage",
          "form",
          "price",
          "medicineImage",
          "offerPercent",
          "stock_quantity",
        ].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              type="text"
              name={field}
              value={(product as any)[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateOfferPage;
