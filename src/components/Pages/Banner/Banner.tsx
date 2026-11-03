import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Style.css";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap, ArrowRight, FileUp } from "lucide-react";

import medicalImage from "../../../assets/medicine-delivery-trends.webp";
import logo2 from "../../../assets/checup.jpg";
import logo3 from "../../../assets/maxresdefault.jpg";
import logo4 from "../../../assets/medical.jpg";

const slides = [
  {
    image: medicalImage,
    tag: "Trusted E-Pharmacy in Bangladesh",
    title: "100% Genuine Medicines Delivered to Your Doorstep",
    desc: "Order prescription drugs, OTC health essentials, and medical supplies with 2-hour express delivery.",
    primaryBtn: { text: "Order Medicines", link: "/products/all-products" },
    secondaryBtn: { text: "Upload Prescription", link: "/upload-prescription" },
  },
  {
    image: logo2,
    tag: "Expert Care & Verification",
    title: "Prescription Checked by Licensed Pharmacists",
    desc: "Our verified pharmacists double-check your dosages and brand alternatives for your family's safety.",
    primaryBtn: { text: "Upload Rx Now", link: "/upload-prescription" },
    secondaryBtn: { text: "Customer Helpline", link: "/contact-page" },
  },
  {
    image: logo3,
    tag: "Hospital Grade Devices",
    title: "Clinical Equipment & Diagnostic Essentials",
    desc: "Accurate digital thermometers, professional stethoscopes, and home healthcare devices at wholesale prices.",
    primaryBtn: { text: "Explore Equipments", link: "/equipments/stethoscope" },
    secondaryBtn: { text: "View All Products", link: "/products/all-products" },
  },
  {
    image: logo4,
    tag: "Everyday Healthcare Savings",
    title: "Save Up To 20% on Monthly Medicine Orders",
    desc: "Never run out of essential chronic medications with our automated refill reminders and special discounts.",
    primaryBtn: { text: "View Special Offers", link: "/products/all-products" },
    secondaryBtn: { text: "Consult Online Doctor", link: "/online-doctor" },
  },
];

const BannerPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] overflow-hidden group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Multi-stage gradient overlay for high readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Slide Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-2xl text-white">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/30 backdrop-blur-md border border-teal-400/40 rounded-full text-teal-200 text-xs font-semibold w-fit mb-3 sm:mb-4 shadow-sm">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>{slide.tag}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm mb-2 sm:mb-3">
                  {slide.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-base text-slate-200/90 leading-relaxed mb-5 sm:mb-6 max-w-lg hidden sm:block">
                  {slide.desc}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to={slide.primaryBtn.link}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 hover:-translate-y-0.5 transition-all"
                  >
                    <span>{slide.primaryBtn.text}</span>
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    to={slide.secondaryBtn.link}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 text-xs sm:text-sm font-semibold rounded-xl hover:-translate-y-0.5 transition-all"
                  >
                    <FileUp size={15} className="text-teal-300" />
                    <span>{slide.secondaryBtn.text}</span>
                  </Link>
                </div>
              </div>

              {/* Express delivery pill bottom right */}
              <div className="absolute bottom-4 right-4 hidden md:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
                <Zap size={14} className="text-amber-400" />
                <span>Express Delivery in 2 Hours</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerPage;
