/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import { ScaleLoader } from "react-spinners";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, HeartPulse } from "lucide-react";

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
  const [animalMedicines, setAnimalMedicines] = useState<AnimalMedicineType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { searchText } = useOutletContext<OutletContextType>();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/animal-medicine`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const filtered = list.filter((item: AnimalMedicineType) =>
          item.name?.toLowerCase().includes((searchText || "").toLowerCase()),
        );
        setAnimalMedicines(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Animal medicine error:", err);
        setLoading(false);
      });
  }, [searchText]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <ScaleLoader color="#0d9488" height={30} />
      </div>
    );
  }

  return (
    <section className="py-12 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold mb-2">
            <HeartPulse size={14} className="text-emerald-600" />
            <span>Veterinary & Pet Care</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Animal & Livestock Medicines
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Quality animal health formulations, poultry supplements, and livestock care products.
          </p>
        </div>

        {/* Grid */}
        {animalMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {animalMedicines.map((medicine, index) => {
              const inStock = Number(medicine.stock) > 0;

              return (
                <motion.div
                  key={medicine._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Image */}
                    <div className="relative bg-slate-50 p-4 h-48 flex items-center justify-center overflow-hidden border-b border-slate-100">
                      <img
                        src={medicine.medicineImage}
                        alt={medicine.name}
                        className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3">
                        {inStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            <AlertCircle size={11} />
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      {medicine.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                          {medicine.category}
                        </span>
                      )}

                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {medicine.name}
                      </h3>

                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-teal-700">
                          ৳{medicine.price}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Stock: {medicine.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-4 pt-0">
                    <Link
                      to={`/animal-medicine/${medicine._id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 group-hover:bg-teal-600 text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      <span>View Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            No animal medicines found matching your criteria.
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimalMedicine;
