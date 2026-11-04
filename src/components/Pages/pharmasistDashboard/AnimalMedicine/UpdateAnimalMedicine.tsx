/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  Spin,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
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

const UpdateAnimalMedicine = () => {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const { themeConfig } = usePharmacistTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `https://pharmadoor-backend-v2.vercel.app/api/v1/animal-medicine/${_id}`,
          {
            headers: { Authorization: `${token}` },
          },
        );

        const data = res.data.data || res.data;
        form.setFieldsValue({
          name: data.name,
          category: data.category,
          price: Number(data.price),
          stock: Number(data.stock),
        });
        setExistingImage(data.medicineImage);
      } catch (err: any) {
        toast.error("Failed to fetch animal medicine data");
      } finally {
        setLoading(false);
      }
    };

    if (_id) fetchMedicine();
  }, [_id, form]);

  const handleUpload = (file: any) => {
    setNewImageFile(file);
    setExistingImage(URL.createObjectURL(file));
    return false;
  };

  const onFinish = async (values: any) => {
    setUpdating(true);
    try {
      let imageUrl = existingImage;

      if (newImageFile) {
        const formData = new FormData();
        formData.append("image", newImageFile);

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
        medicineImage: imageUrl,
      };

      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(
        `https://pharmadoor-backend-v2.vercel.app/api/v1/animal-medicine/${_id}`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      if (res.status === 200) {
        toast.success("Veterinary medicine updated successfully!");
        navigate("/pharmacist-dashboard/All-animal-medicine");
      }
    } catch (err) {
      toast.error("Failed to update medicine");
    } finally {
      setUpdating(false);
    }
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
          <Link to="/pharmacist-dashboard/All-animal-medicine">
            <Button icon={<ArrowLeftOutlined />} shape="circle" size="middle" />
          </Link>
          <div>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Update Veterinary Medicine
            </Title>
            <Text type="secondary" className="text-xs sm:text-sm">
              Adjust stock levels, target animal category, and retail pricing.
            </Text>
          </div>
        </div>

        <Link to="/pharmacist-dashboard/All-animal-medicine">
          <Button>Cancel</Button>
        </Link>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Medicine Name</span>}
                name="name"
                rules={[{ required: true, message: "Please input medicine name" }]}
              >
                <Input size="large" className="rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Category / Animal Target</span>}
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
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
                label={<span className="font-semibold text-slate-700">Stock Quantity</span>}
                name="stock"
                rules={[{ required: true, message: "Please enter stock" }]}
              >
                <InputNumber min={0} prefix={<DatabaseOutlined className="text-slate-400" />} size="large" className="w-full rounded-xl" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<span className="font-semibold text-slate-700">Product Photograph</span>}>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {existingImage ? (
                    <div className="text-center shrink-0">
                      <Image
                        src={existingImage}
                        width={90}
                        height={90}
                        className="rounded-xl object-cover border border-slate-300 shadow-xs"
                      />
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">Current Image</p>
                    </div>
                  ) : null}

                  <div className="flex-1 w-full">
                    <Upload beforeUpload={handleUpload} maxCount={1} showUploadList={false}>
                      <Button icon={<UploadOutlined />} size="large" className="rounded-xl font-semibold">
                        Replace / Choose New Photo
                      </Button>
                    </Upload>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose an image to update the packaging photograph.
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

export default UpdateAnimalMedicine;
