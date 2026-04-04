import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ScaleLoader } from "react-spinners";

type MedicalProduct = {
  _id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock_quantity: number;
  rating: number;
  color: string;
  medicineImage: string;
};
type OutletContextType = {
  searchText: string;
};
const StethoscopePage = () => {
  const { searchText } = useOutletContext<OutletContextType>();
  const [medicalProducts, setMedicalProducts] = useState<MedicalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/equipment")
      .then((res) => res.json())
      .then((data) => {
        const allMedicatProduct = data.data.filter((item: MedicalProduct) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setMedicalProducts(allMedicatProduct);
        setLoading(false);
      });
  }, [searchText]);

  if (loading) {
    return (
      <div className="flex justify-center ">
        <ScaleLoader color="#2cabab" height={35} />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
        Stethoscope Equipments
      </h1>

      <div
        data-aos="zoom-out-left"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {medicalProducts.map((equipment) => (
          <div
            key={equipment._id}
            className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 min-h-[320px] flex flex-col"
          >
            {/* Image with zoom effect */}
            <div className="overflow-hidden">
              <img
                src={equipment.medicineImage}
                alt={equipment.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Card content */}
            <div className="p-4 flex flex-col flex-grow">
              <div className="space-y-2 flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {equipment.name}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>Generic:</strong> {equipment.brand}
                </p>
                <p className="text-lg font-bold text-green-600">
                  {equipment.price} Tk
                </p>
              </div>

              <Link to={`/equipments/${equipment._id}`}>
                <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-md transition-colors duration-300">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {medicalProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No valid Napa Equipments found.
        </p>
      )}
    </div>
  );
};

export default StethoscopePage;
