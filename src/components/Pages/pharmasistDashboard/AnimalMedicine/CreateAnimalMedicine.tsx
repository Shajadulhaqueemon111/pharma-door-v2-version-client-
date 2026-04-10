/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../privateRoute/AuthContext";
import { Form, Input, Button, Card, Typography, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CreateAnimalMedicine = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      let imageUrl = "";

      const file = fileList?.[0]?.originFileObj;

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData,
        );

        imageUrl = res.data?.data?.url;
      }

      const payload = {
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        medicineImage: imageUrl,
        createdBy: {
          _id: String(user?._id),
          name: user?.name,
          email: user?.email,
        },
      };

      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/animal-medicine/create-animalmedicine",
        payload,
        {
          headers: { Authorization: `${token}` },
        },
      );

      if (response.data) {
        message.success("Animal medicine created successfully!");
        navigate("/pharmacist-dashboard/All-animal-medicine");
      }
    } catch (error: any) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Failed to create medicine",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <Card style={{ width: "100%", maxWidth: 600, borderRadius: 12 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
          🐾 Add New Animal Medicine
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          {/* Name */}
          <Form.Item
            label="Medicine Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter medicine name" size="large" />
          </Form.Item>

          {/* Category */}
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter category" }]}
          >
            <Input placeholder="Enter category" size="large" />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input placeholder="Enter price" size="large" />
          </Form.Item>

          {/* Stock */}
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please enter stock" }]}
          >
            <Input placeholder="Enter stock quantity" size="large" />
          </Form.Item>

          {/* Upload Image */}
          <Form.Item label="Medicine Image" required>
            <Upload
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              {loading ? "Submitting..." : "🚀 Submit Medicine"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAnimalMedicine;
