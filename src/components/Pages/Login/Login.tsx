/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import hdVedio from "../../../assets/medicine.mp4";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../privateRoute/AuthContext";
import { jwtDecode } from "jwt-decode";
// import GoogleLogin from "./GoogleLogin";

interface DecodedToken {
  name: string;
  profileImage: string;
  role: string;
  email: string;
  status?: "pending" | "approved" | "rejected";
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Full login response:", response.data);

      const accessToken = response.data?.data?.accessToken;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const role = decoded.role;
      const status = decoded.status;
      const profileImage = decoded.profileImage;
      const name = decoded.name;
      console.log(profileImage, name);
      console.log(decoded);

      if (role === "pharmacist" && status !== "approved") {
        toast.error(
          "Your account is not approved yet. Please wait for admin approval."
        );
        return;
      }

      login(accessToken);
      toast.success("Login successful");

      if (from && from !== "/login" && from !== "/") {
        navigate(from, { replace: true });
      } else {
        if (role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else if (role === "pharmacist") {
          navigate("/pharmacist-dashboard", { replace: true });
        } else if (role === "user") {
          navigate("/", { replace: true });
        } else {
          toast.error("Unknown user role");
        }
      }
    } catch (error: any) {
      toast.error("Invalid email or password");
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const fillDemoCredentials = (role: "admin" | "pharmacist") => {
    if (role === "admin") {
      setEmail("admin@gmail.com");
      setPassword("admin1234");
    } else if (role === "pharmacist") {
      setEmail("mdshajdulhaqueemon8@gmail.com");
      setPassword("12345");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover brightness-75 contrast-125 saturate-125 filter"
      >
        <source src={hdVedio} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>

      {/* Login form container */}
      <div className="relative z-20 bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 tracking-wide">
          Welcome Back
        </h2>

        {/* Demo Credentials Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            Fill Admin Credentials
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("pharmacist")}
            className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            Fill Pharmacist Credentials
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition pr-12 shadow-sm"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-indigo-600 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            Login
          </button>

          {/* Register links */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Register
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-1">
            Are you a Pharmacist?{" "}
            <Link
              to="/phermacist-register"
              className="font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
