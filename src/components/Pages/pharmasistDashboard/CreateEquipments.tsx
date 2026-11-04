/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../privateRoute/AuthContext";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Image,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Rate,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  ToolOutlined,
  PlusOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;
const { Option } = Select;

const equipmentCategories = [
  "Stethoscope",
  "Digital Thermometer",
  "Blood Pressure Monitor",
  "Blood Glucose Meter (Glucometer)",
  "Pulse Oximeter",
  "Nebulizer Machine",
  "Weighing Scale",
  "Surgical Gloves & Mask",
  "Infrared Forehead Thermometer",
  "Wheelchair & Walking Aid",
];

const CreateEquipments = () => {
  const { user } = useAuth();
  const _id = user?._id;
  const name = user?.name;
  const email = user?.email;

  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const imageFile: RcFile | undefined =
        values.medicineImage?.[0]?.originFileObj;
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          formData,
        );
        imageUrl = res.data?.data?.url;
      }

      const payload = {
        name: values.name,
        brand: values.brand,
        category: values.category,
        price: Number(values.price),
        stock_quantity: Number(values.stock_quantity),
        rating: values.rating ? Number(values.rating) : 5,
        color: values.color || "Standard",
        medicineImage: imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
        createdBy: { _id: String(_id), name, email },
      };

      const token = localStorage.getItem("accessToken");
      await axios.post(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/equipment/create-equipment",
        payload,
        {
          headers: { Authorization: `${token}` },
        },
      );

      toast.success("Medical equipment added to catalog!");
      navigate("/pharmacist-dashboard/all-equipment");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create equipment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist-dashboard/all-equipment">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Add Medical Equipment
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              List new diagnostic instruments, hospital devices, and home healthcare aids.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/all-equipment">
          <Button>Cancel</Button>
        </Link>
      </div>

      {/* Main Form Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            category: "Stethoscope",
            stock_quantity: 20,
            price: 1200,
            rating: 5,
            color: "Black / Chrome",
          }}
          requiredMark="optional"
        >
          <Row gutter={[24, 16]}>
            {/* Equipment Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Equipment / Device Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input equipment name" }]}
              >
                <Input
                  prefix={<ToolOutlined className="text-slate-400" />}
                  placeholder="e.g. 3M Littmann Classic III Stethoscope"
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Brand */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Brand / Manufacturer</span>}
                name="brand"
                rules={[{ required: true, message: "Please input brand" }]}
              >
                <Input
                  placeholder="e.g. 3M Littmann, Omron, Beurer, Rossmax"
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Category */}
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Device Category</span>}
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select size="large" className="rounded-xl">
                  {equipmentCategories.map((c) => (
                    <Option key={c} value={c}>
                      {c}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Retail Price */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Retail Price (৳)</span>}
                name="price"
                rules={[{ required: true, message: "Please input price" }]}
              >
                <InputNumber
                  min={1}
                  prefix={<DollarOutlined className="text-slate-400" />}
                  size="large"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Stock Quantity */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Stock Quantity</span>}
                name="stock_quantity"
                rules={[{ required: true, message: "Please input stock count" }]}
              >
                <InputNumber
                  min={1}
                  prefix={<DatabaseOutlined className="text-slate-400" />}
                  size="large"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Color / Variant */}
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Device Finish / Color</span>}
                name="color"
              >
                <Input placeholder="e.g. Matte Black, Classic Silver, Navy Blue" size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            {/* Rating */}
            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Catalog Rating</span>}
                name="rating"
              >
                <Rate allowHalf defaultValue={5} className="mt-1.5" />
              </Form.Item>
            </Col>

            {/* Image Upload */}
            <Col xs={24}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Product Photograph</span>}
                name="medicineImage"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload.Dragger
                  name="image"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={({ fileList }) => {
                    if (fileList.length > 0) handlePreview(fileList[0]);
                    else setPreviewImage("");
                  }}
                  className="rounded-2xl p-4 bg-slate-50 border-dashed border-2 border-slate-300"
                >
                  <p className="ant-upload-drag-icon text-center">
                    <UploadOutlined style={{ fontSize: 32, color: themeConfig.accentColor }} />
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    Click or drag product photo here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    High quality equipment photography helps patient conversions.
                  </p>
                </Upload.Dragger>
              </Form.Item>

              {previewImage && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-4">
                  <Image src={previewImage} width={80} height={80} className="rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Uploaded Device Photo</p>
                    <p className="text-[11px] text-slate-400">Ready to save</p>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <Divider className="my-4" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button size="large" onClick={() => form.resetFields()} className="rounded-xl">
              Reset Form
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={submitting}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Add Equipment
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateEquipments;
