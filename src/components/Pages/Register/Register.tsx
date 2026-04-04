/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import bgVideo from "../../../assets/Science Laboratory 4K Stock Video.mp4";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, include one uppercase and one lowercase letter and one speacial charecter"
      );
      return;
    }
    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/users/create-user",
        userData
      );

      toast.success("Registration successful!");
      console.log("User created:", response.data);
      navigate("/login");
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      toast.error("Registration failed!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover brightness-75 contrast-110 saturate-110 filter z-0"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with subtle blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10"></div>

      {/* Form Container */}
      <div className="relative z-20 bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md mx-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-wide">
          Create Your Account
        </h2>

        <form className="space-y-6" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition pr-12"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
