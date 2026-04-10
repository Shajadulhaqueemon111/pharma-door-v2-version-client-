/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Typography,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CreateOfferProduct = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Image upload handler
  const handleUpload = (file: any) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    return false; // prevent auto upload
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    if (imageFile) {
      formData.append("medicineImage", imageFile);
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Token missing!");
        setLoading(false);
        return;
      }

      await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/offer/create-offer",
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Offer product created successfully!");
      navigate("/pharmacist-dashboard/all-offer-medicine");
    } catch (error: any) {
      toast.error("Failed to create offer product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Create Offer Product
      </Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
          <Input placeholder="Enter brand" />
        </Form.Item>

        <Form.Item name="generic" label="Generic">
          <Input placeholder="Enter generic name" />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item name="dosage" label="Dosage">
          <Input placeholder="Enter dosage" />
        </Form.Item>

        <Form.Item name="form" label="Form">
          <Input placeholder="Tablet / Capsule / Syrup" />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="offerPercent"
          label="Offer Percent (%)"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} max={100} />
        </Form.Item>

        <Form.Item
          name="stock_quantity"
          label="Stock Quantity"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Medicine Image" required rules={[{ required: true }]}>
          <Upload beforeUpload={handleUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                marginTop: 10,
                width: 150,
                height: 150,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <Spin /> : "Create Offer Product"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateOfferProduct;
