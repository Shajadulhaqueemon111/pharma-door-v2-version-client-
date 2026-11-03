import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Activity, CheckCircle2, ArrowRight } from "lucide-react";

type SecloMedicine = {
  _id: string;
  name: string;
  brand: string;
  stock: string;
  price: string;
  medicineImage: string;
  expiryDate?: string;
};

const SecloMedicines = () => {
  const [seclomedicines, setSecloMedicines] = useState<SecloMedicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    fetch("https://pharmadoor-backend-v2.vercel.app/api/v1/medicine", {
      headers: {
        "Cache-Control": "no-cache",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];
        const filtered = list.filter((item: SecloMedicine) => {
          const isSeclo = item.name?.toLowerCase().includes("seclo");

          let isNotExpired = true;
          if (item.expiryDate) {
            const expiry = new Date(item.expiryDate);
            expiry.setHours(0, 0, 0, 0);
            isNotExpired = expiry > today;
          }

          return isSeclo && isNotExpired;
        });

        setSecloMedicines(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ScaleLoader color="#0d9488" height={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
          <Activity size={14} className="text-teal-600" />
          <span>Omeprazole / Gastric Relief</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Seclo Series Medicines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Genuine Square Pharmaceuticals Seclo capsules, tablets, and IV injections.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {seclomedicines.map((medicine) => (
          <div
            key={medicine._id}
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

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={11} />
                    In Stock
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                  {medicine.brand}
                </span>

                <h2 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {medicine.name}
                </h2>

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
                to={`/medicines/secloDetails/${medicine._id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 group-hover:bg-teal-600 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <span>View Details</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecloMedicines;
