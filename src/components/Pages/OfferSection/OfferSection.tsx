/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Card, Row, Col, Typography, Button, Pagination } from "antd";

const { Title, Text } = Typography;

interface OfferMedicine {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  offerPercent: number;
  medicineImage: string;
  stock_quantity: number;
}

type OutletContextType = {
  searchText: string;
};

const OfferSection = () => {
  const [medicineoffers, setMedicineOffers] = useState<OfferMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchText } = useOutletContext<OutletContextType>();

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 6;

  const fetchOfferMedicine = async () => {
    setLoading(true);
    try {
      const response = await axios(
        "https://pharma-door-backend.vercel.app/api/v1/offer",
      );
      setMedicineOffers(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferMedicine();
  }, []);

  // loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ScaleLoader color="#1677ff" />
      </div>
    );
  }

  if (!medicineoffers.length) {
    return <div style={{ textAlign: "center" }}>No Offer Medicine</div>;
  }

  // filter
  const filterOfferProduct = medicineoffers.filter((offers) =>
    offers.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // pagination
  const totalItems = filterOfferProduct.length;
  const startIndex = (currentPage - 1) * itemPerPage;

  const currentItems = filterOfferProduct.slice(
    startIndex,
    startIndex + itemPerPage,
  );

  return (
    <div style={{ padding: "40px 20px", background: "#f5f7fa" }}>
      <div style={{ maxWidth: 1200, margin: "auto" }}>
        {/* Title */}
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 40,
            fontWeight: 700,
          }}
        >
          🔥 Special Offers
        </Title>

        {/* Grid */}
        <Row gutter={[24, 24]}>
          {currentItems.map((product) => {
            const offerPrice =
              parseFloat(product.price) -
              (parseFloat(product.price) * product.offerPercent) / 100;

            return (
              <Col xs={24} sm={12} lg={8} key={product._id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                  }}
                  bodyStyle={{ padding: 16 }}
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={product.name}
                        src={product.medicineImage}
                        style={{
                          height: 200,
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* Discount Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "#ff4d4f",
                          color: "#fff",
                          padding: "5px 12px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {product.offerPercent}% OFF
                      </div>
                    </div>
                  }
                >
                  {/* Name */}
                  <Title level={5} style={{ marginBottom: 6 }}>
                    {product.name}
                  </Title>

                  {/* Info */}
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {product.brand} • {product.form} • {product.dosage}
                  </Text>

                  {/* Stock */}
                  <div style={{ marginTop: 8 }}>
                    <Text>
                      Stock:{" "}
                      <span
                        style={{
                          color:
                            product.stock_quantity > 0 ? "#52c41a" : "#ff4d4f",
                          fontWeight: "bold",
                        }}
                      >
                        {product.stock_quantity > 0
                          ? product.stock_quantity
                          : "Out of Stock"}
                      </span>
                    </Text>
                  </div>

                  {/* Price */}
                  <div style={{ marginTop: 12 }}>
                    <Text
                      strong
                      style={{
                        fontSize: 20,
                        color: "#1677ff",
                      }}
                    >
                      ৳{offerPrice.toFixed(2)}
                    </Text>{" "}
                    <Text delete style={{ fontSize: 14 }}>
                      ৳{parseFloat(product.price).toFixed(2)}
                    </Text>
                  </div>

                  {/* Button */}
                  <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                      marginTop: 15,
                      borderRadius: 10,
                      fontWeight: 600,
                      height: 45,
                    }}
                    href={`/medicines/specialoffer/${product._id}`}
                  >
                    View Details
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Pagination
            current={currentPage}
            pageSize={itemPerPage}
            total={totalItems}
            onChange={(page) => {
              setCurrentPage(page);
              window.scroll({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>

      {/* Hover Effect */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
        `}
      </style>
    </div>
  );
};

export default OfferSection;
