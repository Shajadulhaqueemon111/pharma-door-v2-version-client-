// src/pages/AllUsers.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
type UserType = {
  _id: string;
  name: string;
  email: string;
  status: string;
  role?: string;
};

const AllUsers = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  //   const nevigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/users",
        {
          headers: {
            Authorization: ` ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const allUsers = res.data.data || [];
      const filteredUsers = allUsers.filter(
        (user: UserType & { role: string }) => user.role !== "pharmacist"
      );

      setUsers(filteredUsers);
    } catch (err) {
      toast.error("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (_id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            toast.error("Token does not exist");
            return;
          }

          await axios.delete(
            `https://pharma-door-backend.vercel.app/api/v1/users/${_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire("Deleted!", "User has been deleted.", "success");
          toast.success("User deleted successfully");
          fetchUsers(); // Refresh the list
        } catch (err) {
          console.error(err);
          toast.error("Delete failed");
          Swal.fire("Error", "Something went wrong while deleting!", "error");
        }
      }
    });
  };

  //   const handleUpdate = (id: string) => {
  //     const token = localStorage.getItem("accessToken");

  //     if (!token) {
  //       toast.error("Access denied. Please log in first.");
  //       return;
  //     }

  //     // Navigate to the user edit form
  //     nevigate(`/users/edit/${id}`);
  //     toast("Redirecting to the update form...");
  //   };

  if (loading)
    return (
      <p className="text-center">
        <ScaleLoader color="#2cabab" height={12} />
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">
        All Users
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>

              <th className="p-2 border">Update</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>

                <td className="p-2 border text-center">
                  <Link to={`/dashboard/admin-dashboard/all-users/${user._id}`}>
                    <button
                      // onClick={() => handleUpdate(user._id)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                  </Link>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
