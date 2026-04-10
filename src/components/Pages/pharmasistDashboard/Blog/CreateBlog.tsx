/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Form, Input, Button, Checkbox, Card, Typography, Space } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

const BlogPostForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const blogData = {
      ...values,
      tags: values.tags
        ? values.tags.split(",").map((tag: string) => tag.trim())
        : [],
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Token not found!");
        return;
      }

      const response = await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/blog/create-blog",
        blogData,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Blog created successfully!");
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to post blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card
        style={{ width: "100%", maxWidth: 700, borderRadius: 12 }}
        hoverable
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            ✍️ Create Blog Post
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ published: true }}
          >
            {/* Title */}
            <Form.Item
              label={<Text strong>Title</Text>}
              name="title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input size="large" placeholder="Enter blog title" />
            </Form.Item>

            {/* Content */}
            <Form.Item
              label={<Text strong>Content</Text>}
              name="content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <TextArea
                rows={6}
                placeholder="Write your blog content (you can use line breaks, formatting etc.)"
              />
            </Form.Item>

            {/* Author */}
            <Form.Item
              label={<Text strong>Author</Text>}
              name="author"
              rules={[{ required: true, message: "Please enter author name" }]}
            >
              <Input placeholder="Author name" />
            </Form.Item>

            {/* Tags */}
            <Form.Item label={<Text strong>Tags</Text>} name="tags">
              <Input placeholder="health, fitness, awareness" />
            </Form.Item>

            {/* Category */}
            <Form.Item label={<Text strong>Category</Text>} name="category">
              <Input placeholder="Enter category" />
            </Form.Item>

            {/* Thumbnail */}
            <Form.Item
              label={<Text strong>Thumbnail URL</Text>}
              name="thumbnail"
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>

            {/* Publish */}
            <Form.Item name="published" valuePropName="checked">
              <Checkbox>Publish Now</Checkbox>
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                {loading ? "Posting..." : "🚀 Post Blog"}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default BlogPostForm;
