/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  Button,
  Switch,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Select,
} from "antd";
import {
  EditOutlined,
  SendOutlined,
  TagsOutlined,
  FileTextOutlined,
  PictureOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "../pharmacistTheme";

const { Title, Text } = Typography;
const { TextArea } = Input;

const blogCategories = [
  "Medication Safety & Proper Usage",
  "Antibiotic Resistance & Stewardship",
  "Seasonal Illness & Prevention",
  "Diabetes & Chronic Care Management",
  "Heart Health & Hypertension",
  "Pediatric & Child Wellness",
  "Vaccination & Immunization",
  "Nutrition & Dietary Supplements",
];

const BlogPostForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { themeConfig } = usePharmacistTheme();

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const blogData = {
      ...values,
      tags: values.tags
        ? typeof values.tags === "string"
          ? values.tags.split(",").map((tag: string) => tag.trim())
          : values.tags
        : [],
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Token not found! Please login.");
        return;
      }

      const response = await axios.post(
        "https://pharmadoor-backend-v2.vercel.app/api/v1/blog/create-blog",
        blogData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Health advisory blog article published!");
        form.resetFields();
      }
    } catch (error) {
      toast.error("Failed to publish blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Pharmacist Healthcare Blog Studio
            </Title>
            <Tag color="cyan" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Patient Education
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Draft verified medical education, medication tips, and wellness advisories for patients.
          </Text>
        </div>
      </div>

      <Card bordered={false} className="shadow-xs rounded-2xl border border-slate-200/80 p-2 sm:p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ published: true, category: "Medication Safety & Proper Usage" }}
          requiredMark="optional"
        >
          <Row gutter={[24, 16]}>
            {/* Title */}
            <Col xs={24}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Article Title</span>}
                name="title"
                rules={[{ required: true, message: "Please input blog title" }]}
              >
                <Input
                  prefix={<FileTextOutlined className="text-slate-400" />}
                  placeholder="e.g. 5 Common Drug Interactions Every Patient Should Know"
                  size="large"
                  className="rounded-xl font-bold"
                />
              </Form.Item>
            </Col>

            {/* Author Name */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Author Name & Credentials</span>}
                name="author"
                rules={[{ required: true, message: "Please enter author" }]}
              >
                <Input
                  prefix={<EditOutlined className="text-slate-400" />}
                  placeholder="e.g. Md Sajedul Haque Emon, B.Pharm, R.Ph"
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Category */}
            <Col xs={24} md={12}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Advisory Category</span>}
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select size="large" className="rounded-xl">
                  {blogCategories.map((c) => (
                    <Select.Option key={c} value={c}>{c}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Cover Image URL */}
            <Col xs={24}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Hero Cover Image URL</span>}
                name="image"
                rules={[{ required: true, message: "Please provide a valid image URL" }]}
              >
                <Input
                  prefix={<PictureOutlined className="text-slate-400" />}
                  placeholder="https://images.unsplash.com/photo-..."
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Content Body */}
            <Col xs={24}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Educational Article Content</span>}
                name="content"
                rules={[{ required: true, message: "Please write article content" }]}
              >
                <TextArea
                  rows={8}
                  placeholder="Share pharmacist guidance on dosage intervals, side effects, storage temperature, or chronic disease control..."
                  className="rounded-2xl p-4 text-sm leading-relaxed"
                />
              </Form.Item>
            </Col>

            {/* Tags */}
            <Col xs={24} md={16}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Search Tags (Comma Separated)</span>}
                name="tags"
              >
                <Input
                  prefix={<TagsOutlined className="text-slate-400" />}
                  placeholder="Antibiotics, Dosage, Cold, Paracetamol"
                  size="large"
                  className="rounded-xl"
                />
              </Form.Item>
            </Col>

            {/* Published Switch */}
            <Col xs={24} md={8}>
              <Form.Item
                label={<span className="font-semibold text-slate-700">Publication Status</span>}
                name="published"
                valuePropName="checked"
              >
                <div className="flex items-center gap-3 pt-1">
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                  />
                  <span className="text-xs text-slate-600 font-medium">Publish immediately</span>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-4" />

          <div className="flex items-center justify-end gap-3">
            <Button size="large" onClick={() => form.resetFields()} className="rounded-xl">
              Clear
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="px-6 shadow-md"
            >
              Publish Article
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BlogPostForm;
