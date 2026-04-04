import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ScaleLoader } from "react-spinners";

type PharmacistType = {
  _id: string;
  user: string;
  name: string;
  address: string;
  storeName: string;
  phone: string;
  email: string;
  postCode: string;
  nid: string;
  nidImage: string;
  drugLicenseImage: string;
  tradeLicenseImage: string;
  status: string;
  createdAt: string;
};

const PharmacistDocument = () => {
  const [pharmacists, setPharmacists] = useState<PharmacistType[]>([]);
  const [filtered, setFiltered] = useState<PharmacistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPharmacists = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/phermacist",
        {
          headers: { Authorization: `${token}` },
        }
      );
      setPharmacists(res.data.data);
      setFiltered(res.data.data);
    } catch (error) {
      toast.error("Failed to load pharmacists");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  // Handle Search
  useEffect(() => {
    const lower = search.toLowerCase();
    const result = pharmacists.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.email.toLowerCase().includes(lower) ||
        item.phone.includes(lower) ||
        item.storeName.toLowerCase().includes(lower)
    );
    setFiltered(result);
  }, [search, pharmacists]);

  if (loading)
    return (
      <p className="text-center">
        <ScaleLoader color="#2cabab" height={12} />
      </p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pharmacist Documents</h1>

      <input
        type="text"
        placeholder="Search by name, email, phone, or store name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded mb-6 focus:outline-none focus:ring focus:border-blue-500"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-red-500">
          No matching pharmacist found.
        </p>
      ) : (
        <div className="grid gap-6">
          {filtered.map((pharmacist) => (
            <PharmacistCard key={pharmacist._id} pharmacist={pharmacist} />
          ))}
        </div>
      )}
    </div>
  );
};

const PharmacistCard = ({ pharmacist }: { pharmacist: PharmacistType }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-linear-to-bl from-violet-500 to-fuchsia-500 p-4 rounded shadow">
      <div className="mb-2 space-y-1">
        <p>
          <strong>Name:</strong> {pharmacist.name}
        </p>
        <p>
          <strong>Email:</strong> {pharmacist.email}
        </p>
        <p>
          <strong>Store:</strong> {pharmacist.storeName}
        </p>
        {/* <p>
          <strong>Status:</strong>{" "}
          <span className="text-green-600">{pharmacist.status}</span>
        </p> */}
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showDetails ? "Hide Details" : "View Details"}
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <p>
            <strong>Phone:</strong> {pharmacist.phone}
          </p>
          <p>
            <strong>Address:</strong> {pharmacist.address}
          </p>
          <p>
            <strong>Post Code:</strong> {pharmacist.postCode}
          </p>
          <p>
            <strong>NID:</strong> {pharmacist.nid}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(pharmacist.createdAt).toLocaleDateString()}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="font-semibold mb-1">NID Image</p>
              <img
                src={pharmacist.nidImage}
                alt="NID"
                className="rounded  border shadow-md transition-transform duration-300 hover:scale-200 cursor-zoom-in"
              />
            </div>
            <div>
              <p className="font-semibold mb-1">Drug License</p>
              <img
                src={pharmacist.drugLicenseImage}
                alt="Drug License"
                className="rounded border shadow-md transition-transform duration-300 hover:scale-200 cursor-zoom-in"
              />
            </div>
            <div>
              <p className="font-semibold mb-1">Trade License</p>
              <img
                src={pharmacist.tradeLicenseImage}
                alt="Trade License"
                className="rounded border shadow-md transition-transform duration-300 hover:scale-200 cursor-zoom-in"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistDocument;
