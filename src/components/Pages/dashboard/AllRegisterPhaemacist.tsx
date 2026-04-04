import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";

type UserType = {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected" | undefined;
  role: "user" | "admin" | "pharmacist";
};

const AllRegisterPharmacist = () => {
  const [pharmacists, setPharmacists] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPharmacists = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/users",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const allUsers: UserType[] = res.data.data || [];

      const filtered = allUsers.filter((user) => user.role === "pharmacist");

      setPharmacists(filtered);
    } catch (error) {
      toast.error("Failed to fetch pharmacists");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
          toast.success("pharmacist deleted successfully");
          fetchPharmacists();
        } catch (err) {
          console.error(err);
          toast.error("Delete failed");
          Swal.fire("Error", "Something went wrong while deleting!", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  if (loading)
    return (
      <p className="text-center">
        <ScaleLoader color="#2cabab" height={12} />
      </p>
    );

  if (pharmacists.length === 0)
    return <p className="text-center">No pending pharmacists found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-cyan-600">
        All Pending Pharmacists
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Update</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {pharmacists.map((user) => (
              <tr key={user._id}>
                <td className="p-2 border  text-xs sm:text-sm">{user.name}</td>
                <td className="p-2 border text-xs sm:text-sm">{user.email}</td>
                <td className="p-2 border text-xs sm:text-sm">{user.role}</td>
                <td
                  className={`p-2 border text-xs sm:text-sm text-white text-center
    ${
      user.status === "pending"
        ? "bg-yellow-500"
        : user.status === "approved"
        ? "bg-green-600"
        : user.status === "rejected"
        ? "bg-red-600"
        : "bg-gray-400"
    }
                `}
                >
                  {user.status}
                </td>

                <td className="p-2 border space-x-2 text-center text-xs sm:text-sm">
                  <Link to={`/admin-dashboard/all-pharmacist/${user._id}`}>
                    <button className="bg-blue-500 cursor-pointer text-white px-2 py-1 rounded hover:bg-blue-600">
                      Update
                    </button>
                  </Link>
                </td>
                <td className="p-2 border space-x-2 text-center text-xs sm:text-sm">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRegisterPharmacist;
