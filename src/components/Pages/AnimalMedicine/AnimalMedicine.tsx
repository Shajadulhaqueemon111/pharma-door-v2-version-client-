/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Card, Row, Col, Typography, Button } from "antd";
import { ScaleLoader } from "react-spinners";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

type AnimalMedicineType = {
  _id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  medicineImage: string;
};

type OutletContextType = {
  searchText: string;
};

const AnimalMedicine = () => {
  const [animalMedicines, setAnimalMedicines] = useState<AnimalMedicineType[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { searchText } = useOutletContext<OutletContextType>();

  useEffect(() => {
    fetch("https://pharma-door-backend.vercel.app/api/v1/animal-medicine")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.data.filter((item: AnimalMedicineType) =>
          item.name?.toLowerCase().includes(searchText.toLowerCase()),
        );
        setAnimalMedicines(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchText]);

  // Loader
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
        <ScaleLoader color="#1677ff" />
      </div>
    );
  }

  return (
    <div style={{ padding: "50px 20px", background: "#f5f7fa" }}>
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
          🐾 Animal Medicines
        </Title>

        {/* Grid */}
        {animalMedicines.length > 0 ? (
          <Row gutter={[24, 24]}>
            {animalMedicines.map((medicine, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={medicine._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    }}
                    bodyStyle={{ padding: 15 }}
                    cover={
                      <div style={{ overflow: "hidden" }}>
                        <img
                          src={medicine.medicineImage}
                          alt={medicine.name}
                          style={{
                            height: 180,
                            width: "100%",
                            objectFit: "cover",
                            transition: "0.3s",
                          }}
                          className="hover-img"
                        />
                      </div>
                    }
                  >
                    <Title level={5} style={{ marginBottom: 5 }}>
                      {medicine.name}
                    </Title>

                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {medicine.category}
                    </Text>

                    {/* Stock */}
                    <div style={{ marginTop: 6 }}>
                      <Text>
                        Stock:{" "}
                        <span
                          style={{
                            color:
                              parseInt(medicine.stock) > 0
                                ? "#52c41a"
                                : "#ff4d4f",
                            fontWeight: "bold",
                          }}
                        >
                          {parseInt(medicine.stock) > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </Text>
                    </div>

                    {/* Price */}
                    <div style={{ marginTop: 10 }}>
                      <Text
                        strong
                        style={{
                          fontSize: 18,
                          color: "#1677ff",
                        }}
                      >
                        ৳{medicine.price}
                      </Text>
                    </div>

                    {/* Button */}
                    <Link to={`/animal-medicine/${medicine._id}`}>
                      <Button
                        type="primary"
                        block
                        style={{
                          marginTop: 12,
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        View Details
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <Text style={{ display: "block", textAlign: "center" }}>
            No animal medicines found.
          </Text>
        )}
      </div>

      {/* Hover Animation */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }

        .hover-img:hover {
          transform: scale(1.1);
        }
        `}
      </style>
    </div>
  );
};

export default AnimalMedicine;
