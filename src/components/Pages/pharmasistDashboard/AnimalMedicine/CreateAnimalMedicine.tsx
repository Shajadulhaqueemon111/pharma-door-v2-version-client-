/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../privateRoute/AuthContext";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Upload,
  Row,
  Col,
  Divider,
  Image,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { usePharmacistTheme } from "../pharmacistTheme";

const { Title, Text } = Typography;
const { Option } = Select;

const animalCategories = [
  "Cattle / Dairy / Bovine",
  "Poultry & Avian",
  "Pet Care (Dogs & Cats)",
  "Sheep & Goats",
  "Aquaculture & Fish Care",
  "Equine / Horses",
  "General Veterinary Supplement",
];

const CreateAnimalMedicine = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [preview, setPreview] = useState("");

  const handleUpload = (file: any) => {
    setPreview(URL.createObjectURL(file));
    return false;
  };

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
        price: String(values.price),
        stock: String(values.stock),
        medicineImage: imageUrl || "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=400&auto=format&fit=crop",
        createdBy: {
          _id: String(user?._id),
          name: user?.name,
          email: user?.email,
        },
      };

      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/animal-medicine/create-animalmedicine`,
        payload,
        {
          headers: { Authorization: `${token}` },
        },
      );

      if (response.data) {
        toast.success("Veterinary medicine created successfully!");
        navigate("/pharmacist-dashboard/All-animal-medicine");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create animal medicine",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/pharmacist-dashboard/All-animal-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Add Veterinary Medicine
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Register livestock, poultry, and domestic pet health solutions.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/All-animal-medicine">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            category: "Cattle / Dairy / Bovine",
            price: 150,
            stock: 50,
          }}
          requiredMark="optional"
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Medicine Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input medicine name" }]}
              >
                <Input size="large" className="rounded-xl" placeholder="e.g. Renamycin 100ml / Bovine Care" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Target Animal / Category</span>}
                name="category"
                rules={[{ required: true, message: "Please select animal category" }]}
              >
                <Select size="large" className="rounded-xl">
                  {animalCategories.map((c) => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Retail Price (৳)</span>}
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber min={1} prefix={<DollarOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Initial Stock Units</span>}
                name="stock"
                rules={[{ required: true, message: "Please enter stock quantity" }]}
              >
                <InputNumber min={1} prefix={<DatabaseOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Product Photograph</span>}>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {preview ? (
                    <div className="text-center shrink-0">
                      <Image
                        src={preview}
                        width={90}
                        height={90}
                        className="rounded-xl object-cover border border-slate-300 shadow-xs"
                      />
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">Photo Preview</p>
                    </div>
                  ) : null}

                  <div className="flex-1 w-full">
                    <Upload
                      beforeUpload={handleUpload}
                      maxCount={1}
                      onChange={({ fileList }) => setFileList(fileList)}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />} size="large" className="rounded-xl font-semibold">
                        Choose Veterinary Product Image
                      </Button>
                    </Upload>
                    <p className="text-xs text-slate-400 mt-1">
                      Clear photos showing dosage and administration guidelines recommended.
                    </p>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Link to="/pharmacist-dashboard/All-animal-medicine">
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
              Add to Catalog
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAnimalMedicine;
