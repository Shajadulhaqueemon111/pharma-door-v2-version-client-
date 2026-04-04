import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../Firebase/Firebase";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-500 hover:from-black hover:to-gray-900 text-white font-semibold shadow-md hover:shadow-lg transition duration-300"
    >
      <span className="bg-white p-2 rounded-full">
        <FcGoogle className="text-black group-hover:scale-110 transition-transform duration-300" />
      </span>
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleLogin;
