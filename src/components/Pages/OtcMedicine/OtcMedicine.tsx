import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Link } from "react-router-dom";
import { Pill, ArrowRight, Sparkles } from "lucide-react";

import OtcBannerPage from "./OtcBannerPage";
import Review from "../Banner/Review";
import SubscribeSection from "../Banner/SubscribeSection";
import HowItWorks from "../BlogSection/HowItsWork";
import AnimalMedicine from "../AnimalMedicine/AnimalMedicine";

type Medicine = {
  id: number;
  name: string;
  medicineType: string;
  description: string;
  image: string;
};

const OtcMedicine = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    fetch("/otcmedicine.json")
      .then((res) => res.json())
      .then((data) => setMedicines(data))
      .catch((err) => console.error("Error fetching OTC medicines:", err));
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-2">
            <Pill size={14} className="text-teal-600" />
            <span>Over-The-Counter Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Medicines by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Safe, non-prescription remedies for pain relief, cough, cold, digestive care & everyday wellness.
          </p>
        </div>

        {/* Categories Swiper */}
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="pb-12"
        >
          {medicines.map((med) => (
            <SwiperSlide key={med.id}>
              <Link
                to={`/otc-medicine-details?type=${encodeURIComponent(med.medicineType)}`}
                className="group block h-full"
              >
                <div className="h-full bg-slate-50/70 hover:bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    {/* Image Area */}
                    <div className="w-full h-44 bg-white rounded-xl p-4 flex items-center justify-center border border-slate-100 shadow-2xs group-hover:scale-102 transition-transform duration-300">
                      <img
                        src={med.image}
                        alt={med.name || med.medicineType}
                        className="max-h-36 max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 mb-1">
                        <Sparkles size={13} />
                        <span>Featured Category</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {med.medicineType}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {med.description}
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Explore Medicines
                      <ArrowRight size={14} />
                    </span>
                    <span className="w-8 h-8 rounded-full bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Extra Sub-Sections */}
      <div className="mt-6">
        <OtcBannerPage />
      </div>

      <div className="mt-6" id="animal-medicine">
        <AnimalMedicine />
      </div>

      <div className="mt-6">
        <HowItWorks />
      </div>

      <div className="mt-6">
        <Review />
      </div>

      <div className="mt-6">
        <SubscribeSection />
      </div>
    </section>
  );
};

export default OtcMedicine;
