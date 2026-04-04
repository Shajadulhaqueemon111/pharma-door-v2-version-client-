// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import "./style.css";

// import required modules
import { Navigation } from "swiper/modules";
import percentageImage from "../../../assets/percentage.png";

const AdditionalOffer = () => {
  return (
    <div className="max-w-md mx-auto">
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        {[1, 2, 3].map((_, i) => (
          <SwiperSlide key={i}>
            <div className="flex h-50 w-80 items-center bg-blue-100 p-4 rounded-lg gap-4">
              <img
                className="w-16 h-16 object-contain"
                src={percentageImage}
                alt="offer"
              />
              <div>
                <p className="text-green-500 font-semibold">Cashback</p>
                <p className="text-green-500 font-semibold">50tk</p>
                <p className="text-sm text-gray-700">
                  For purchasing above <br /> 65000+
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AdditionalOffer;
