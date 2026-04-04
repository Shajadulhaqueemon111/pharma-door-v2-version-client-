import React from "react";
import { useAuth } from "../privateRoute/AuthContext";

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-500 font-semibold">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Background banner */}
      <div
        className="h-40 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://i.ibb.co/k2Yq6CzT/istockphoto-1203733319-612x612.jpg')`,
        }}
      ></div>

      {/* Profile Info */}
      <div className="flex flex-col items-center -mt-16 px-6 pb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img
            src={user.profileImage || "https://i.pravatar.cc/300?img=5"}
            alt="User Avatar"
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
        <p className="text-gray-600">{user.role || "User"}</p>

        <div className="w-full text-center mt-8 space-y-4 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold ">📧 Email: {user.email}</h2>
            <p></p>
          </div>
        </div>

        <div className="mt-6">
          {/* <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-semibold transition">
            Edit Profile
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
