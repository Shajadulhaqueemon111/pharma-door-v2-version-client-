import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import bgVideo from "../../../assets/Science Laboratory 4K Stock Video.mp4";

const PharmacistRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    storeName: "",
    phone: "",
    email: "",
    postCode: "",
    nid: "",
    password: "",
  });

  const [images, setImages] = useState<{
    profileImage: File | null;
    drugLicenseImage: File | null;
    nidImage: File | null;
    tradeLicenseImage: File | null;
  }>({
    profileImage: null,
    drugLicenseImage: null,
    nidImage: null,
    tradeLicenseImage: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof images
  ) => {
    const file = e.target.files?.[0] || null;
    setImages((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !images.profileImage ||
      !images.drugLicenseImage ||
      !images.nidImage ||
      !images.tradeLicenseImage
    ) {
      toast.error("Please upload all required documents.");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      // ১) ফাইলগুলো append
      form.append("profileImage", images.profileImage);
      form.append("drugLicenseImage", images.drugLicenseImage);
      form.append("nidImage", images.nidImage);
      form.append("tradeLicenseImage", images.tradeLicenseImage);

      // ২) **শুধুমাত্র একবার** 'data' নামে JSON.stringify() দিয়ে append
      form.append(
        "body",
        JSON.stringify({
          password: formData.password,
          pharmacist: {
            name: formData.name,
            address: formData.address,
            storeName: formData.storeName,
            phone: formData.phone,
            email: formData.email,
            postCode: formData.postCode,
            nid: formData.nid,
          },
        })
      );

      // ৩) POST request
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/users/create-phermasist",
        form
      );

      console.log(response);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="relative z-10 max-w-xl w-full p-6 bg-white/90 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Pharmacist Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", type: "text", placeholder: "Name" },
            { name: "address", type: "text", placeholder: "Address" },
            { name: "storeName", type: "text", placeholder: "Store Name" },
            { name: "phone", type: "tel", placeholder: "Phone Number" },
            { name: "email", type: "email", placeholder: "Email" },
            { name: "postCode", type: "text", placeholder: "Post Code" },
            { name: "nid", type: "text", placeholder: "NID Number" },
            { name: "password", type: "password", placeholder: "Password" },
          ].map((input) => (
            <input
              key={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.placeholder}
              value={formData[input.name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          ))}

          {/* File Uploads */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium">Your Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "profileImage")}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Drug License Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "drugLicenseImage")}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">NID Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "nidImage")}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Trade License Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "tradeLicenseImage")}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PharmacistRegister;
