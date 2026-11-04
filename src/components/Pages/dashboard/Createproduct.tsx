/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Createproduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://pharmadoor-backend-v2.vercel.app/api/products",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Master product created successfully!");
        form.resetFields();
        navigate("/admin-dashboard/products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating master product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin-dashboard/products">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Create Master Catalog Product
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Define a global pharmaceutical formulation or device in the core PharmaDoor product catalog.
            </Text>
          </div>
        </div>

        <Link to="/admin-dashboard/products">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
          <Row gutter={[24, 16]}>
            {/* Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Product Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input product name" }]}
              >
                <Input
                  prefix={<MedicineBoxOutlined className="text-slate-400" />}
                  placeholder="e.g. Napa Extend"
                  size="large"
                  className="rounded-xl font-bold"
                />
              </Form.Item>
            </Col>

            {/* Category */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Category</span>}
                name="category"
                rules={[{ required: true, message: "Please input category" }]}
              >
                <Input placeholder="e.g. Analgesic & Antipyretic" size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            {/* Generic */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Generic Name</span>}
                name="generic"
                rules={[{ required: true, message: "Please input generic" }]}
              >
                <Input placeholder="e.g. Paracetamol" size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            {/* Strength */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Strength (mg/ml)</span>}
                name="strength"
                rules={[{ required: true, message: "Please input strength" }]}
              >
                <Input placeholder="e.g. 665 mg" size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            {/* Dosage Form */}
            <Col xs={24} md={8}>
              <Form.Item label={<span className="font-semibold text-slate-700">Form</span>} name="form">
                <Input placeholder="e.g. Extended Release Tablet" size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            {/* Manufacturer */}
            <Col xs={24} md={8}>
              <Form.Item label={<span className="font-semibold text-slate-700">Manufacturer</span>} name="manufacturer">
                <Input placeholder="e.g. Beximco Pharmaceuticals" size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            {/* Unit Price */}
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Reference Price (৳)</span>}
                name="price"
                rules={[{ required: true, message: "Please enter reference price" }]}
              >
                <InputNumber min={0.5} prefix={<DollarOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            {/* Image URL */}
            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Image Asset URL</span>} name="image">
                <Input
                  prefix={<PictureOutlined className="text-slate-400" />}
                  placeholder="https://images.unsplash.com/..."
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Therapeutic Uses */}
            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Indications & Therapeutic Uses</span>} name="uses">
                <TextArea
                  rows={4}
                  placeholder="e.g. For prolonged relief of pain and fever including toothache, joint pain, migraine, and osteoarthritis..."
                  className="rounded-2xl p-3"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Button size="large" onClick={() => form.resetFields()} className="rounded-xl">
              Clear Fields
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={loading}
              style={{
                backgroundColor: "#0d9488",
                borderColor: "#0d9488",
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Publish to Master Catalog
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Createproduct;
