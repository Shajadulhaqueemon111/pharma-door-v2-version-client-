import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, Typography, Rate, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const reviews = [
  {
    name: "Dr. Mahmud Hasan",
    rating: 5,
    comment: "Very fast delivery and authentic medicines. Highly recommend!",
  },
  {
    name: "Farhana Akter",
    rating: 4,
    comment: "Customer service was helpful and delivery was quick.",
  },
  {
    name: "Tanvir Hossain",
    rating: 5,
    comment: "Excellent app for emergency medicine needs!",
  },
  {
    name: "Rumana Sultana",
    rating: 5,
    comment: "Safe packaging and affordable prices.",
  },
];

const Review = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "60px 20px", background: "#f5f7fa" }}>
      <div style={{ maxWidth: 800, margin: "auto", textAlign: "center" }}>
        {/* Title */}
        <Title level={2} style={{ marginBottom: 10 }}>
          💬 Customer Reviews
        </Title>

        <Text type="secondary">What our customers say about Pharmadoor</Text>

        {/* Review Card */}
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: 40 }}
        >
          <Card
            style={{
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            }}
          >
            {/* Avatar */}
            <Avatar
              size={70}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#1677ff",
                marginBottom: 15,
              }}
            />

            {/* Comment */}
            <p
              style={{
                fontSize: 16,
                fontStyle: "italic",
                color: "#555",
                marginBottom: 15,
              }}
            >
              “{reviews[current].comment}”
            </p>

            {/* Rating */}
            <Rate
              disabled
              defaultValue={reviews[current].rating}
              style={{ marginBottom: 10 }}
            />

            {/* Name */}
            <Text strong style={{ display: "block" }}>
              — {reviews[current].name}
            </Text>
          </Card>
        </motion.div>
      </div>

      {/* Hover Effect */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        }
        `}
      </style>
    </div>
  );
};

export default Review;
