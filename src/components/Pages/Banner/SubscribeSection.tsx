import { useState } from "react";
import { motion } from "framer-motion";
import { Input, Button, Typography, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div style={{ padding: "60px 20px", background: "#f5f7fa" }}>
      <div style={{ maxWidth: 900, margin: "auto", textAlign: "center" }}>
        {/* Title */}
        <Title level={2} style={{ marginBottom: 10 }}>
          📩 Subscribe for Updates & Offers
        </Title>

        <Text type="secondary">
          Get the latest medicine deals, health tips & exclusive offers.
        </Text>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{ marginTop: 40 }}
        >
          <Card
            style={{
              borderRadius: 20,
              padding: 30,
              background: "linear-gradient(135deg, #1677ff, #69b1ff)",
              color: "#fff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
            bodyStyle={{ padding: 0 }}
          >
            <Title level={3} style={{ color: "#fff" }}>
              Stay Connected 💙
            </Title>

            <Text style={{ color: "#e6f4ff" }}>
              Join our newsletter for exclusive updates and offers.
            </Text>

            {/* Form */}
            <div
              style={{
                marginTop: 25,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  maxWidth: 300,
                  borderRadius: 10,
                }}
              />

              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                style={{
                  background: "#fff",
                  color: "#1677ff",
                  fontWeight: 600,
                  borderRadius: 10,
                }}
              >
                Subscribe
              </Button>
            </div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 15 }}
              >
                <Text style={{ color: "#d9f7be", fontWeight: 500 }}>
                  ✅ Thank you for subscribing!
                </Text>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Hover Effect */}
      <style>
        {`
        .ant-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.2) !important;
        }
        `}
      </style>
    </div>
  );
};

export default SubscribeSection;
