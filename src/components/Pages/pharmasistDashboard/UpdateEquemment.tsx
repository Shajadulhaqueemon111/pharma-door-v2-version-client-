/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Spin,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const UpdateEquipment = () => {
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [preview, setPreview] = useState("");

  // Load existing data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("Token missing");
          return;
        }

        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/equipment/${_id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );

        const data = res.data?.data;

        form.setFieldsValue({
          name: data.name,
          brand: data.brand,
          category: data.category,
          color: data.color,
          price: data.price,
          stock_quantity: data.stock_quantity,
          rating: data.rating,
        });

        setPreview(data.medicineImage);
      } catch (err) {
        toast.error("Failed to load equipment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [_id]);

  // Image Upload Handler
  const handleUpload = (file: any) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    return false; // prevent auto upload
  };

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized!");

    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (imageFile) {
        formData.append("medicineImage", imageFile);
      }

      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/equipment/${_id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Equipment updated successfully!");
      navigate("/pharmacist-dashboard/all-equipment");
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  // ✅ Loading Spinner (Center)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Update Equipment
      </Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
          <Input placeholder="Enter brand" />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item name="color" label="Color">
          <Input placeholder="Enter color" />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="stock_quantity"
          label="Stock Quantity"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="rating" label="Rating">
          <InputNumber step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Medicine Image">
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
          <Button type="primary" htmlType="submit" block>
            Update Equipment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateEquipment;
