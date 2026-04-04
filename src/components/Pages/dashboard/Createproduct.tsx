/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

const Createproduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    generic: "",
    strength: "",
    form: "",
    manufacturer: "",
    uses: "",
    price: "",
    image: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/products",
        product,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer YOUR_ADMIN_TOKEN", // token lagle uncomment korben
          },
        }
      );

      if (response.status === 201) {
        alert("Product created successfully!");
        setProduct({
          name: "",
          category: "",
          generic: "",
          strength: "",
          form: "",
          manufacturer: "",
          uses: "",
          price: "",
          image: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-5 text-center">Create Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="generic"
          placeholder="Generic"
          value={product.generic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="strength"
          placeholder="Strength (e.g. 500 mg)"
          value={product.strength}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="form"
          placeholder="Form (Tablet, Capsule...)"
          value={product.form}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="manufacturer"
          placeholder="Manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="uses"
          placeholder="Uses (comma separated)"
          value={product.uses}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.01"
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={product.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default Createproduct;
