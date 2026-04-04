import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateAllUser = () => {
  const { _id } = useParams();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [role, setRole] = useState("");
  const nevigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/users/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log(response);
        setUser(response.data?.data);
        setRole(response.data?.data?.role);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    if (_id) fetchUser();
  }, [_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/users/${_id}`,
        { role },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.success("User role updated successfully!");
      nevigate("/dashboard/admin-dashboard/all-users");
    } catch (error) {
      console.error("Failed to update user role", error);
      toast.error("Error updating role");
    }
  };

  if (!user) return <div>Loading user...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Update Role for {user.name}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-md"
      >
        <label className="block mb-4">
          <span className="text-gray-700">Select Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Update Role
        </button>
      </form>
    </div>
  );
};

export default UpdateAllUser;
