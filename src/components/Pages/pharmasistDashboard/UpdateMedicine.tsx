/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  useGetSingleMedicineQuery,
  useUpdateMedicineMutation,
} from "../../../redux/api/medicineApi";
import { toast } from "react-hot-toast";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Upload,
  Image,
  Spin,
  Card,
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const UpdateMedicine = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();

  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);

  const { data: medData, isLoading: loading } = useGetSingleMedicineQuery(_id as string, {
    skip: !_id,
  });
  const [updateMedicineMutation] = useUpdateMedicineMutation();

  useEffect(() => {
    if (medData) {
      form.setFieldsValue({
        name: medData.name,
        brand: medData.brand,
        price: medData.price,
        stock: medData.stock,
        medicineType: medData.medicineType || "Tablet",
        manufactureDate: medData.manufactureDate ? dayjs(medData.manufactureDate) : undefined,
        expiryDate: medData.expiryDate ? dayjs(medData.expiryDate) : undefined,
      });

      if (medData.medicineImage) {
        setPreviewImage(medData.medicineImage);
      }
    }
  }, [medData, form]);

  const uploadImageToImgbb = async (image: File): Promise<string | null> => {
    const body = new FormData();
    body.set("image", image);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
        body,
      );
      return response.data.data.url;
    } catch (err) {
      toast.error("Image upload failed!");
      return null;
    }
  };

  const onFinish = async (values: any) => {
    setSubmitLoading(true);
    try {
      let uploadedImageUrl = previewImage;

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const uploaded = await uploadImageToImgbb(fileList[0].originFileObj);
        if (!uploaded) return;
        uploadedImageUrl = uploaded;
      }

      const payload = {
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        medicineImage: uploadedImageUrl,
        manufactureDate: values.manufactureDate ? values.manufactureDate.toDate() : undefined,
        expiryDate: values.expiryDate.toDate(),
      };

      await updateMedicineMutation({ id: _id as string, data: payload }).unwrap();

      toast.success("Medicine updated successfully!");
      navigate("/pharmacist-dashboard/all-medicine");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Update failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePreview = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" />
        <Text type="secondary" className="text-xs">Loading medicine details...</Text>
      </div>
    );
  }

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
              Update Medicine Specs
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Adjust retail price, restock inventory count, or modify shelf expiration date.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/all-medicine">
          <Button>Cancel</Button>
        </Link>
      </div>

      {/* Main Form Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
          <Row gutter={[24, 16]}>
            {/* Medicine Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Medicine Trade Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input medicine name" }]}
              >
                <Input
                  prefix={<MedicineBoxOutlined className="text-slate-400" />}
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Brand */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Pharmaceutical Brand</span>}
                name="brand"
                rules={[{ required: true, message: "Please select manufacturer" }]}
              >
                <Select
                  showSearch
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

            {/* Dosage Form */}
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
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  min={0.1}
                  step={0.5}
                  prefix={<DollarOutlined className="text-slate-400" />}
                  size="large"
                  className="w-full rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Stock Quantity */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Available Stock Quantity</span>}
                name="stock"
                rules={[{ required: true, message: "Please enter stock" }]}
              >
                <InputNumber
                  min={0}
                  prefix={<DatabaseOutlined className="text-slate-400" />}
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
                <DatePicker size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            {/* Expiry Date */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Expiration Date (EXP)</span>}
                name="expiryDate"
                rules={[{ required: true, message: "Please select expiry date" }]}
              >
                <DatePicker size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            {/* Image Upload & Current Preview */}
            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Packaging Image</span>}>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {previewImage ? (
                    <div className="text-center shrink-0">
                      <Image
                        src={previewImage}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover border border-slate-300 shadow-xs"
                      />
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">Current Image</p>
                    </div>
                  ) : null}

                  <div className="flex-1 w-full">
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      onChange={({ fileList }) => {
                        setFileList(fileList);
                        if (fileList.length > 0) handlePreview(fileList[0]);
                      }}
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />} size="large" className="rounded-xl font-semibold">
                        Replace / Upload New Image
                      </Button>
                    </Upload>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload a new file to update the product photograph.
                    </p>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-4" />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Link to="/pharmacist-dashboard/all-medicine">
              <Button size="large" className="rounded-xl">
                Cancel
              </Button>
            </Link>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitLoading}
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

export default UpdateMedicine;
