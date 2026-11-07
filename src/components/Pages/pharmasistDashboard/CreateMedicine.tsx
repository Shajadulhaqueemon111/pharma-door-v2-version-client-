/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../privateRoute/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCreateMedicineMutation } from "../../../redux/api/medicineApi";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Upload,
  Image,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import { useState } from "react";
import type { RcFile } from "antd/es/upload";
import { usePharmacistTheme } from "./pharmacistTheme";

const { Title, Text } = Typography;
const { Option } = Select;

const medicineCategories = [
  "Tablet",
  "Capsule",
  "Syrup / Suspension",
  "Injection",
  "Ointment / Cream",
  "Eye / Ear Drops",
  "Inhaler",
  "Suppository",
  "Powder / Sachet",
  "Medical Device",
];

const popularBrands = [
  "Beximco Pharmaceuticals",
  "Square Pharmaceuticals",
  "Incepta Pharmaceuticals",
  "Renata Limited",
  "ACI Healthcare",
  "Opsonin Pharma",
  "Eskayef Pharmaceuticals (SK+F)",
  "Aristopharma",
  "Drug International",
  "Popular Pharmaceuticals",
];

const CreateMedicine = () => {
  const { user } = useAuth();
  const _id = user?._id;
  const name = user?.name;
  const email = user?.email;

  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [createMedicineMutation] = useCreateMedicineMutation();

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      let imageUrl = "";
      const imageFile: RcFile | undefined =
        values.medicineImage?.[0]?.originFileObj;

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
        price: Number(values.price),
        stock: Number(values.stock),
        medicineType: values.medicineType,
        manufactureDate: values.manufactureDate ? values.manufactureDate.toDate() : new Date(),
        expiryDate: values.expiryDate.toDate(),
        medicineImage: imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
        createdBy: { _id: String(_id), name, email },
      };

      await createMedicineMutation(payload as any).unwrap();

      toast.success("Medicine added to inventory successfully!");
      navigate("/pharmacist-dashboard/all-medicine");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Failed to create medicine",
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
          <Link to="/pharmacist-dashboard/all-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Add New Medicine
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Register a new pharmaceutical product with batch, price, stock, and expiry dates.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/all-medicine">
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
            medicineType: "Tablet",
            stock: 100,
            price: 15,
          }}
          requiredMark="optional"
        >
          <Row gutter={[24, 16]}>
            {/* Medicine Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Medicine Trade Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input medicine trade name" }]}
              >
                <Input
                  prefix={<MedicineBoxOutlined className="text-slate-400" />}
                  placeholder="e.g. Napa Extra 500mg"
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Brand / Manufacturer */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Pharmaceutical Brand</span>}
                name="brand"
                rules={[{ required: true, message: "Please select or input manufacturer brand" }]}
              >
                <Select
                  showSearch
                  placeholder="Select or type manufacturer"
                  size="large"
                  className="rounded-xl"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {popularBrands.map((b) => (
                    <Option key={b} value={b}>
                      {b}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Medicine Category / Dosage Form */}
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Dosage Form</span>}
                name="medicineType"
                rules={[{ required: true, message: "Please select dosage form" }]}
              >
                <Select size="large" className="rounded-xl">
                  {medicineCategories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Unit Retail Price */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Unit Retail Price (৳)</span>}
                name="price"
                rules={[{ required: true, message: "Please enter unit retail price" }]}
              >
                <InputNumber
                  min={0.1}
                  step={0.5}
                  prefix={<DollarOutlined className="text-slate-400" />}
                  placeholder="0.00"
                  size="large"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Initial Stock Quantity */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Initial Stock Units</span>}
                name="stock"
                rules={[{ required: true, message: "Please enter initial quantity" }]}
              >
                <InputNumber
                  min={1}
                  prefix={<DatabaseOutlined className="text-slate-400" />}
                  placeholder="100"
                  size="large"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Divider className="my-2" />
            </Col>

            {/* Manufacture Date */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Manufacture Date (MFG)</span>}
                name="manufactureDate"
              >
                <DatePicker size="large" className="w-full rounded-xl" placeholder="Select MFG Date" />
              </Form.Item>
            </Col>

            {/* Expiry Date */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Expiration Date (EXP)</span>}
                name="expiryDate"
                rules={[{ required: true, message: "Please select expiration date" }]}
              >
                <DatePicker size="large" className="w-full rounded-xl" placeholder="Select EXP Date" />
              </Form.Item>
            </Col>

            {/* Image Upload */}
            <Col xs={24}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Medicine Product Packaging Image</span>}
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
                    Click or drag medicine image packaging here to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports high-resolution JPG, PNG, or WEBP up to 5MB
                  </p>
                </Upload.Dragger>
              </Form.Item>

              {previewImage && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-4">
                  <Image src={previewImage} width={80} height={80} className="rounded-lg object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Uploaded Image Preview</p>
                    <p className="text-[11px] text-slate-400">Ready for catalog publication</p>
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
              Save & Add to Inventory
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateMedicine;
