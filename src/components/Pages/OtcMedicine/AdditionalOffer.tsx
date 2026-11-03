import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import percentageImage from "../../../assets/percentage.png";
import { Sparkles, Tag } from "lucide-react";

const promoOffers = [
  {
    title: "Instant 5% Cashback",
    amount: "Up to ৳500",
    condition: "On all online orders above ৳2,000",
    code: "HEALTH5",
  },
  {
    title: "Free Express Shipping",
    amount: "৳0 Delivery",
    condition: "On all orders above ৳1,000 in Savar & Dhaka",
    code: "FREESHIP",
  },
  {
    title: "Wholesale Partner Rebate",
    amount: "Up to 15% OFF",
    condition: "For licensed retail pharmacies & clinics",
    code: "B2BSAVE",
  },
];

const AdditionalOffer = () => {
  return (
    <div className="w-full">
      <Swiper
        navigation={true}
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={1}
        className="rounded-2xl overflow-hidden"
      >
        {promoOffers.map((promo, i) => (
          <SwiperSlide key={i}>
            <div className="flex items-center gap-4 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 p-4 rounded-2xl shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-white p-2 border border-teal-100 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  className="w-full h-full object-contain"
                  src={percentageImage}
                  alt="Discount percentage"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700">
                  <Sparkles size={12} />
                  <span>{promo.title}</span>
                </div>
                <p className="text-sm font-extrabold text-slate-800">
                  {promo.amount}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {promo.condition}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white text-teal-800 border border-dashed border-teal-300 rounded-lg text-xs font-mono font-bold shrink-0">
                <Tag size={12} />
                <span>{promo.code}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdditionalOffer;
