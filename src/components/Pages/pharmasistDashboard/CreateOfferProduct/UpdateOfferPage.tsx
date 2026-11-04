/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Spin,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Tag,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  DollarOutlined,
  PercentageOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "../pharmacistTheme";

const { Title, Text } = Typography;

type OfferProduct = {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  medicineImage: string;
  offerPercent: string;
  stock_quantity: string;
};

const UpdateOfferPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();
  const [form] = Form.useForm();
  const [product, setProduct] = useState<OfferProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://pharmadoor-backend-v2.vercel.app/api/v1/offer/${_id}`,
        );
        const data = response.data?.data;
        setProduct(data);
        form.setFieldsValue({
          name: data.name,
          brand: data.brand,
          generic: data.generic,
          category: data.category,
          dosage: data.dosage,
          form: data.form,
          price: Number(data.price),
          offerPercent: Number(data.offerPercent),
          stock_quantity: Number(data.stock_quantity),
        });
      } catch (error) {
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id, form]);

  const priceVal = Form.useWatch("price", form) || 0;
  const offerVal = Form.useWatch("offerPercent", form) || 0;
  const discountedPrice = Math.max(0, priceVal - (priceVal * offerVal) / 100);

  const handleSubmit = async (values: any) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://pharmadoor-backend-v2.vercel.app/api/v1/offer/${_id}`,
        values,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      if (response.status === 200) {
        toast.success("Offer product updated successfully!");
        navigate("/pharmacist-dashboard/all-offer-medicine");
      }
    } catch (error) {
      toast.error("Failed to update offer product");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading promotional details...</Text>
      </div>
    );
  }

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
              Update Offer Details
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Adjust promotional markdown percentage, pricing, and available promotional inventory.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/all-offer-medicine">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
          <Row gutter={[24, 16]}>
            {/* Live Pricing Preview Badge */}
            <Col xs={24}>
              <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-teal-50 border border-pink-200/60 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {product.medicineImage && (
                    <Image
                      src={product.medicineImage}
                      width={50}
                      height={50}
                      className="rounded-xl object-cover border border-pink-200"
                    />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{product.name}</span>
                    <span className="text-[11px] text-slate-500">{product.brand}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[11px] text-slate-400 line-through block">৳ {Number(priceVal).toFixed(2)}</span>
                    <span className="text-base font-extrabold text-emerald-600">৳ {discountedPrice.toFixed(2)}</span>
                  </div>
                  <Tag color="magenta" className="font-extrabold text-xs px-2.5 py-1 rounded-full">
                    {offerVal}% OFF
                  </Tag>
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Product Name</span>} name="name" rules={[{ required: true }]}>
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Brand</span>} name="brand" rules={[{ required: true }]}>
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Generic Formula</span>} name="generic" rules={[{ required: true }]}>
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span className="font-semibold text-slate-700">Category</span>} name="category" rules={[{ required: true }]}>
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label={<span className="font-semibold text-slate-700">Dosage</span>} name="dosage">
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item label={<span className="font-semibold text-slate-700">Form</span>} name="form">
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Form.Item label={<span className="font-semibold text-slate-700">Regular Price (৳)</span>} name="price" rules={[{ required: true }]}>
                <InputNumber min={1} prefix={<DollarOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Form.Item label={<span className="font-semibold text-slate-700">Discount %</span>} name="offerPercent" rules={[{ required: true }]}>
                <InputNumber min={1} max={90} prefix={<PercentageOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Form.Item label={<span className="font-semibold text-slate-700">Stock Units</span>} name="stock_quantity" rules={[{ required: true }]}>
                <InputNumber min={0} prefix={<DatabaseOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
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
              icon={<SaveOutlined />}
              loading={updating}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateOfferPage;
