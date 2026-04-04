import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import OtcBannerPage from "./OtcBannerPage";
import Review from "../Banner/Review";
import SubscribeSection from "../Banner/SubscribeSection";
// import BlogPage from "../BlogSection/Blog";
import HowItWorks from "../BlogSection/HowItsWork";
import { Link } from "react-router-dom";
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
  const imazeStyle = {
    height: "180px",
    width: "180px",
  };
  useEffect(() => {
    fetch("/otcmedicine.json")
      .then((res) => res.json())
      .then((data) => setMedicines(data));
  }, []);

  return (
    <div className="mt-5 px-4">
      <h1 className="text-center mt-4 mb-4 text-3xl  font-bold  text-blue-700  tracking-wide">
        OTC Medicines Category
      </h1>

      <Swiper
        spaceBetween={30} // increased space between slides for better clarity
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="mySwiper px-4 py-6"
      >
        {medicines.map((med) => (
          <SwiperSlide key={med.id} className="flex justify-center">
            <Link
              to={`/otc-medicine-details?type=${med.medicineType}`}
              className=" w-full max-w-sm rounded-xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              <img
                style={imazeStyle}
                src={med.image}
                alt={med.name}
                className="mx-auto object-contain mb-4"
              />
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {med.medicineType}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {med.description}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-10">
        <OtcBannerPage />
      </div>
      {/* <div className="mt-10">
        <BlogPage />
      </div> */}
      <div>
        <AnimalMedicine />
      </div>
      <div className="mt-10">
        <HowItWorks />
      </div>
      <div className="mt-10">
        <Review />
      </div>
      <div className="mt-10">
        <SubscribeSection />
      </div>
    </div>
  );
};

export default OtcMedicine;
