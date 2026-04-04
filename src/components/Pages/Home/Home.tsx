import BannerPage from "../Banner/Banner";
import BannerCard from "../Banner/BannerCard";
import DiscountPopup from "../DiscountPopup/DiscountPopup";

import OtcMedicine from "../OtcMedicine/OtcMedicine";

const HomePage = () => {
  return (
    <div>
      <DiscountPopup />
      <BannerPage />
      <BannerCard />
      <OtcMedicine />
    </div>
  );
};

export default HomePage;
