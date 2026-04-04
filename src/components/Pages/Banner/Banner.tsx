import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Style.css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import medicalImage from "../../../assets/medicine-delivery-trends.webp";
import logo2 from "../../../assets/checup.jpg";
import logo3 from "../../../assets/maxresdefault.jpg";
import logo4 from "../../../assets/medical.jpg";

const BannerPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-xl shadow-lg"
      >
        {[medicalImage, logo2, logo3, logo4].map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] rounded-xl overflow-hidden">
              <img
                src={img}
                alt={`banner-${index}`}
                className="w-full h-full object-cover"
              />
              {/* Optional gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* Example text */}
              {/* <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl sm:text-4xl font-bold">Your Banner Title</h2>
                <p className="text-sm sm:text-lg">Your description here...</p>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerPage;
