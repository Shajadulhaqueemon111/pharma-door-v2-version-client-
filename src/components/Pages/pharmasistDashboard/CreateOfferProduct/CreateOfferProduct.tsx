/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../../../config/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Tag,
  Image,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  PercentageOutlined,
  DollarOutlined,
  DatabaseOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "../pharmacistTheme";

const { Title, Text } = Typography;

const CreateOfferProduct = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();

  // Watch price and offer for live calculator
  const priceVal = Form.useWatch("price", form) || 0;
  const offerVal = Form.useWatch("offerPercent", form) || 0;
  const discountedPrice = Math.max(0, priceVal - (priceVal * offerVal) / 100);

  const handleUpload = (file: any) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    return false;
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
        toast.error("Token missing! Please login.");
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/v1/offer/create-offer`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Promotional offer created successfully!");
      navigate("/pharmacist-dashboard/all-offer-medicine");
    } catch (error: any) {
      toast.error("Failed to create offer product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist-dashboard/all-offer-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Create Promotional Offer
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Publish a discount deal with percentage markdown for consumer discovery.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/all-offer-medicine">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            price: 250,
            offerPercent: 15,
            stock_quantity: 50,
            dosage: "500 mg",
            form: "Tablet",
          }}
          requiredMark="optional"
        >
          <Row gutter={[24, 16]}>
            {/* Live Pricing Preview Badge */}
            <Col xs={24}>
              <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-teal-50 border border-pink-200/60 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <GiftOutlined style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Promotional Deal Preview</span>
                    <span className="text-[11px] text-slate-500">Live price calculation visible to shoppers</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">৳ {Number(priceVal).toFixed(2)}</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      ৳ {discountedPrice.toFixed(2)}
                    </span>
                  </div>
                  <Tag color="magenta" className="font-extrabold text-xs px-2.5 py-1 rounded-full">
                    {offerVal}% OFF
                  </Tag>
                </div>
              </div>
            </Col>

            {/* Medicine Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Product Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input product name" }]}
              >
                <Input size="large" className="rounded-xl" placeholder="e.g. Ceevit 250mg Vitamin C" />
              </Form.Item>
            </Col>

            {/* Brand */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Brand / Manufacturer</span>}
                name="brand"
                rules={[{ required: true, message: "Please input brand" }]}
              >
                <Input size="large" className="rounded-xl" placeholder="e.g. Square Pharmaceuticals" />
              </Form.Item>
            </Col>

            {/* Generic */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Generic Formula</span>}
                name="generic"
                rules={[{ required: true, message: "Please input generic name" }]}
              >
                <Input size="large" className="rounded-xl" placeholder="e.g. Ascorbic Acid" />
              </Form.Item>
            </Col>

            {/* Category */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Category</span>}
                name="category"
                rules={[{ required: true, message: "Please input category" }]}
              >
                <Input size="large" className="rounded-xl" placeholder="e.g. Vitamins & Supplements" />
              </Form.Item>
            </Col>

            {/* Dosage */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item label={<span className="font-semibold text-slate-700">Dosage Strength</span>} name="dosage">
                <Input size="large" className="rounded-xl" placeholder="500 mg" />
              </Form.Item>
            </Col>

            {/* Form */}
            <Col xs={24} sm={12} md={6}>
              <Form.Item label={<span className="font-semibold text-slate-700">Form</span>} name="form">
                <Input size="large" className="rounded-xl" placeholder="Chewable Tablet" />
              </Form.Item>
            </Col>

            {/* Original Price */}
            <Col xs={24} sm={12} md={4}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Regular Price (৳)</span>}
                name="price"
                rules={[{ required: true, message: "Enter regular price" }]}
              >
                <InputNumber min={1} prefix={<DollarOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            {/* Offer Percent */}
            <Col xs={24} sm={12} md={4}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Discount %</span>}
                name="offerPercent"
                rules={[{ required: true, message: "Enter discount %" }]}
              >
                <InputNumber min={1} max={90} prefix={<PercentageOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            {/* Stock */}
            <Col xs={24} sm={12} md={4}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Stock Qty</span>}
                name="stock_quantity"
                rules={[{ required: true, message: "Enter stock" }]}
              >
                <InputNumber min={1} prefix={<DatabaseOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            {/* Image Upload */}
            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Product Photograph</span>}>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {preview ? (
                    <div className="text-center shrink-0">
                      <Image
                        src={preview}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover border border-slate-300 shadow-xs"
                      />
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">Photo Preview</p>
                    </div>
                  ) : null}

                  <div className="flex-1 w-full">
                    <Upload beforeUpload={handleUpload} maxCount={1} showUploadList={false}>
                      <Button icon={<UploadOutlined />} size="large" className="rounded-xl font-semibold">
                        Select Product Photo
                      </Button>
                    </Upload>
                    <p className="text-xs text-slate-400 mt-1">
                      Clear photos with original packaging produce highest click-through rate.
                    </p>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Link to="/pharmacist-dashboard/all-offer-medicine">
              <Button size="large" className="rounded-xl">Cancel</Button>
            </Link>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={loading}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Publish Offer Product
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateOfferProduct;
