import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Card, Typography, Button } from "antd";

import { Link } from "react-router-dom";

import OtcBannerPage from "./OtcBannerPage";
import Review from "../Banner/Review";
import SubscribeSection from "../Banner/SubscribeSection";
import HowItWorks from "../BlogSection/HowItsWork";
import AnimalMedicine from "../AnimalMedicine/AnimalMedicine";

const { Title, Text } = Typography;

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
      .then((data) => setMedicines(data));
  }, []);

  return (
    <div style={{ padding: "40px 20px", background: "#f5f7fa" }}>
      {/* Title */}
      <Title
        level={2}
        style={{
          textAlign: "center",
          fontWeight: 700,
          marginBottom: 30,
        }}
      >
        💊 OTC Medicines Category
      </Title>

      {/* Slider */}
      <Swiper
        spaceBetween={25}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="px-2 py-6"
      >
        {medicines.map((med) => (
          <SwiperSlide key={med.id}>
            <Link to={`/otc-medicine-details?type=${med.medicineType}`}>
              <Card
                hoverable
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  height: "100%",
                }}
                bodyStyle={{ padding: 20 }}
                cover={
                  <div
                    style={{
                      background: "#f0f5ff",
                      padding: 20,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={med.image}
                      alt={med.name}
                      style={{
                        height: 150,
                        objectFit: "contain",
                        transition: "0.3s",
                      }}
                    />
                  </div>
                }
              >
                <div style={{ textAlign: "center" }}>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {med.medicineType}
                  </Title>

                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {med.description}
                  </Text>

                  <Button
                    type="primary"
                    shape="round"
                    style={{
                      marginTop: 15,
                      padding: "0 25px",
                      height: 40,
                      fontWeight: 600,
                    }}
                  >
                    Explore
                  </Button>
                </div>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Extra Sections */}
      <div style={{ marginTop: 50 }}>
        <OtcBannerPage />
      </div>

      <div style={{ marginTop: 50 }}>
        <AnimalMedicine />
      </div>

      <div style={{ marginTop: 50 }}>
        <HowItWorks />
      </div>

      <div style={{ marginTop: 50 }}>
        <Review />
      </div>

      <div style={{ marginTop: 50 }}>
        <SubscribeSection />
      </div>

      {/* Hover Animation */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        }

        .ant-card:hover img {
          transform: scale(1.1);
        }
        `}
      </style>
    </div>
  );
};

export default OtcMedicine;
