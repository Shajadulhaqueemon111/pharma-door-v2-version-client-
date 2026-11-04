/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate, useParams, Link } from "react-router-dom";
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
  Card,
  Row,
  Col,
  Divider,
  Image,
  Rate,
  Select,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  ToolOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
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

const UpdateEquipment = () => {
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();
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
          `https://pharmadoor-backend-v2.vercel.app/api/v1/equipment/${_id}`,
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
  }, [_id, form]);

  const handleUpload = (file: any) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    return false;
  };

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Unauthorized!");

    setSubmitting(true);
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (imageFile) {
        formData.append("medicineImage", imageFile);
      }

      await axios.patch(
        `https://pharmadoor-backend-v2.vercel.app/api/v1/equipment/${_id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Medical equipment updated successfully!");
      navigate("/pharmacist-dashboard/all-equipment");
    } catch (err) {
      toast.error("Update failed!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading equipment details...</Text>
      </div>
    );
  }

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
              Update Equipment Specs
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Adjust retail pricing, restock units, or change product descriptions.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/all-equipment">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Equipment Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input equipment name" }]}
              >
                <Input
                  prefix={<ToolOutlined className="text-slate-400" />}
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Brand</span>}
                name="brand"
                rules={[{ required: true, message: "Please input brand" }]}
              >
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Category</span>}
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select size="large" className="rounded-xl">
                  {equipmentCategories.map((c) => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

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

            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Stock Quantity</span>}
                name="stock_quantity"
                rules={[{ required: true, message: "Please input stock" }]}
              >
                <InputNumber
                  min={0}
                  prefix={<DatabaseOutlined className="text-slate-400" />}
                  size="large"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Color / Finish</span>}
                name="color"
              >
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Rating</span>}
                name="rating"
              >
                <Rate allowHalf className="mt-1.5" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Equipment Photograph</span>}>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {preview ? (
                    <div className="text-center shrink-0">
                      <Image
                        src={preview}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover border border-slate-300 shadow-xs"
                      />
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">Current Photo</p>
                    </div>
                  ) : null}

                  <div className="flex-1 w-full">
                    <Upload
                      beforeUpload={handleUpload}
                      maxCount={1}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />} size="large" className="rounded-xl font-semibold">
                        Replace / Choose New Photo
                      </Button>
                    </Upload>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose an image from your computer to update the listing.
                    </p>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Link to="/pharmacist-dashboard/all-equipment">
              <Button size="large" className="rounded-xl">Cancel</Button>
            </Link>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
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

export default UpdateEquipment;
