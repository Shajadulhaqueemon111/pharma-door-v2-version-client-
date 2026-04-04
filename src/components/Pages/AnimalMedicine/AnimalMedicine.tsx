import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ScaleLoader } from "react-spinners";

type AnimalMedicineType = {
  _id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  medicineImage: string;
};

type OutletContextType = {
  searchText: string;
};

const AnimalMedicine = () => {
  const [animalMedicines, setAnimalMedicines] = useState<AnimalMedicineType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { searchText } = useOutletContext<OutletContextType>();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/animal-medicine", {
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.data.filter((item: AnimalMedicineType) =>
          item.name?.toLowerCase().includes(searchText.toLowerCase())
        );
        setAnimalMedicines(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching medicines:", err);
        setLoading(false);
      });
  }, [searchText]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <ScaleLoader color="#2cabab" height={35} />
      </div>
    );
  }

  return (
    <div className="px-4 py-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
        Animal Medicines
      </h1>

      {animalMedicines.length > 0 ? (
        <div
          data-aos="fade-up"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {animalMedicines.map((medicine) => (
            <div
              key={medicine._id}
              className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={medicine.medicineImage}
                  alt={medicine.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {medicine.name}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {medicine.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Stock:</strong>{" "}
                  {parseInt(medicine.stock) > 0 ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      Out of Stock
                    </span>
                  )}
                </p>
                <p className="text-xl font-bold text-green-600">
                  {medicine.price} Tk
                </p>

                <Link to={`/animal-medicine/${medicine._id}`}>
                  <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-lg shadow transition-colors duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No animal medicines found.
        </p>
      )}
    </div>
  );
};

export default AnimalMedicine;
