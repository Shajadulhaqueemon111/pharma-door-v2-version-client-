import { motion } from "framer-motion";
import { Card, Typography, Row, Col } from "antd";
import OtcImage from "../../../assets/otcbanner.png";

const { Title, Text } = Typography;

const features = [
  {
    title: "On Call Doctor",
    description:
      "Our expert and cooperative doctors are available on call to provide you with fast and helpful advice.",
  },
  {
    title: "e-Diagnosis",
    description:
      "Osudpotro offers the best online diagnosis service with fast response, quick sample collection, digital reports, and free doctor consultation.",
  },
  {
    title: "Dedicated Call Center",
    description:
      "Our call center is operated by experienced teleconsultants available 24/7 to serve all customers efficiently.",
  },
];

const OtcBannerPage = () => {
  return (
    <div style={{ padding: "50px 20px", maxWidth: 1200, margin: "auto" }}>
      {/* 🔥 HERO BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: 20,
          padding: "40px 30px",
          background: "linear-gradient(135deg, #1677ff, #69b1ff)",
          color: "#fff",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        }}
      >
        {/* Left Text */}
        <div style={{ maxWidth: 500 }}>
          <Title level={2} style={{ color: "#fff", marginBottom: 10 }}>
            💊 OTC Medicines
          </Title>

          <Text style={{ color: "#f0f5ff", fontSize: 15 }}>
            OTC medicine refers to medicines that can be bought without a
            prescription. These are commonly used for treating pain, colds,
            coughs, fever, and other minor health issues quickly and safely.
          </Text>
        </div>

        {/* Image */}
        <motion.img
          src={OtcImage}
          alt="OTC Banner"
          style={{
            width: 260,
            objectFit: "contain",
          }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* 🔥 FEATURE CARDS */}
      <Row gutter={[24, 24]} style={{ marginTop: 50 }}>
        {features.map((feature, index) => (
          <Col xs={24} md={8} key={index}>
            <motion.div
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card
                style={{
                  borderRadius: 18,
                  textAlign: "center",
                  padding: 10,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Title
                  level={4}
                  style={{
                    color: "#1677ff",
                    marginBottom: 10,
                  }}
                >
                  {feature.title}
                </Title>

                <Text type="secondary" style={{ fontSize: 14 }}>
                  {feature.description}
                </Text>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Hover Style */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }
        `}
      </style>
    </div>
  );
};

export default OtcBannerPage;
