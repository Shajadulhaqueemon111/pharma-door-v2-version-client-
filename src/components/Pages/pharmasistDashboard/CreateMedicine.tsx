/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../privateRoute/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Upload,
  Image,
} from "antd";

import { useState } from "react";
import dayjs from "dayjs";
import type { RcFile } from "antd/es/upload";

const { Option } = Select;

const CreateMedicine = () => {
  const { user } = useAuth();
  const _id = user?._id;
  const name = user?.name;
  const email = user?.email;

  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState<string>("");

  const onFinish = async (values: any) => {
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
        manufactureDate: values.manufactureDate.toDate(),
        expiryDate: values.expiryDate.toDate(),
        medicineImage: imageUrl,
        createdBy: { _id: String(_id), name, email },
      };

      const token = localStorage.getItem("accessToken");
      await axios.post(
        "https://pharma-door-backend.vercel.app/api/v1/medicine",
        payload,
        {
          headers: { Authorization: `${token}` },
        },
      );

      toast.success("Medicine created successfully!");
      navigate("/pharmacist-dashboard/all-medicine");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create medicine",
      );
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Add New Medicine
      </h2>

      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ medicineType: "" }}
      >
        {/* Name */}
        <Form.Item
          label="Medicine Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter medicine name" />
        </Form.Item>

        {/* Brand */}
        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: "Brand is required" }]}
        >
          <Input placeholder="Enter brand name" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Price is required" },
            { type: "number", min: 0, message: "Price must be positive" },
          ]}
        >
          <InputNumber
            placeholder="Enter price"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        {/* Stock */}
        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            { required: true, message: "Stock is required" },
            { type: "number", min: 0, message: "Stock must be positive" },
          ]}
        >
          <InputNumber
            placeholder="Enter stock quantity"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        {/* Medicine Type */}
        <Form.Item
          label="Medicine Type"
          name="medicineType"
          rules={[{ required: true, message: "Medicine type is required" }]}
        >
          <Select placeholder="Select medicine type">
            <Option value="Fever">Fever</Option>
            <Option value="Headache">Headache</Option>
            <Option value="Diarrhea">Diarrhea</Option>
            <Option value="Eczema">Eczema</Option>
            <Option value="Pregnancy">Pregnancy</Option>
          </Select>
        </Form.Item>

        {/* Manufacture Date */}
        <Form.Item
          label="Manufacture Date"
          name="manufactureDate"
          rules={[{ required: true, message: "Manufacture date is required" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current > dayjs()}
          />
        </Form.Item>

        {/* Expiry Date */}
        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[{ required: true, message: "Expiry date is required" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs()}
          />
        </Form.Item>

        {/* Medicine Image */}
        <Form.Item
          label="Medicine Image"
          name="medicineImage"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Image is required" }]}
        >
          <Upload
            name="medicineImage"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => handlePreview(info.file)}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {/* Preview */}
        {previewImage && (
          <div className="mb-4 text-center">
            <Image src={previewImage} alt="Preview" width={150} />
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMedicine;
