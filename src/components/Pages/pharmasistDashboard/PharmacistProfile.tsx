/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../privateRoute/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Upload,
  message,
  Spin,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const PharmacistProfile = () => {
  const { user, updateUser } = useAuth();
  const _id = user?._id;

  const [form] = Form.useForm();

  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // Image Upload
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData,
      );
      const imageUrl = response.data.data.display_url;
      setProfileImage(imageUrl);
      message.success("Image uploaded successfully!");
    } catch (error) {
      message.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/users/${_id}`,
        { ...values, profileImage },
        { headers: { Authorization: `${token}` } },
      );

      if (response.data) {
        message.success("Profile updated successfully!");
        updateUser(response.data.user);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Something went wrong while updating.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <Card
        style={{ maxWidth: 600, width: "100%" }}
        title={
          <Title level={3} style={{ color: "#1677ff", margin: 0 }}>
            Pharmacist Profile
          </Title>
        }
      >
        <Text type="danger">
          ⚠️ After updating your profile, you will be logged out automatically
          for security purposes. Please log in again to see your updated
          details.
        </Text>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user?.name,
            email: user?.email,
          }}
          onFinish={handleUpdate}
        >
          {/* Profile Image */}
          <Form.Item label="Profile Image">
            <div className="flex flex-col items-center mb-4">
              <img
                src={profileImage || "https://i.pravatar.cc/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-md mb-2"
              />
              <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                  handleImageUpload(file);
                  return false; // prevent automatic upload
                }}
              >
                <Button icon={<UploadOutlined />} loading={uploadingImage}>
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </Button>
              </Upload>
            </div>
          </Form.Item>

          {/* Full Name */}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          {/* Profile Image URL */}
          <Form.Item label="Profile Image URL">
            <Input
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="Profile Image URL"
            />
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PharmacistProfile;
