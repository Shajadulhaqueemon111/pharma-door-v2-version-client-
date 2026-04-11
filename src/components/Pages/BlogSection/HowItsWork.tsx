import { Row, Col, Card, Typography } from "antd";
import { motion } from "framer-motion";
import {
  SearchOutlined,
  UploadOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const steps = [
  {
    id: 1,
    title: "Search Medicine",
    description: "Find your required medicines quickly using our smart search.",
    icon: <SearchOutlined style={{ fontSize: 30 }} />,
  },
  {
    id: 2,
    title: "Upload Prescription",
    description:
      "Upload your doctor’s prescription securely to get exact medicines.",
    icon: <UploadOutlined style={{ fontSize: 30 }} />,
  },
  {
    id: 3,
    title: "Fast Delivery",
    description:
      "Get your medicines delivered at your doorstep quickly and safely.",
    icon: <RocketOutlined style={{ fontSize: 30 }} />,
  },
];

const HowItWorks = () => {
  return (
    <div style={{ padding: "60px 20px", background: "#f5f7fa" }}>
      <div style={{ maxWidth: 1100, margin: "auto", textAlign: "center" }}>
        {/* Title */}
        <Title level={2} style={{ marginBottom: 10 }}>
          🚀 How Pharmadoor Works
        </Title>

        <Text type="secondary" style={{ fontSize: 15 }}>
          Follow these simple steps to get your medicines delivered hassle-free.
        </Text>

        {/* Steps */}
        <Row gutter={[24, 24]} style={{ marginTop: 50 }}>
          {steps.map((step, index) => (
            <Col xs={24} md={8} key={step.id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Card
                  style={{
                    borderRadius: 18,
                    padding: "20px 10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* Step Number */}
                  <div
                    style={{
                      position: "absolute",
                      top: -15,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#1677ff",
                      color: "#fff",
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      background: "#e6f4ff",
                      width: 70,
                      height: 70,
                      margin: "20px auto",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#1677ff",
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <Title level={4}>{step.title}</Title>
                  <Text type="secondary">{step.description}</Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Hover Effect */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        }
        `}
      </style>
    </div>
  );
};

export default HowItWorks;
