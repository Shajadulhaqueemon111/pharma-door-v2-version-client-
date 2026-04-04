/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

const UpdateMedicine = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); // ✅ Button loading
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        );
        const data = res.data?.data;

        form.setFieldsValue({
          name: data.name,
          brand: data.brand,
          price: data.price,
          stock: data.stock,
          medicineType: data.medicineType,
          manufactureDate: dayjs(data.manufactureDate),
          expiryDate: dayjs(data.expiryDate),
        });

        if (data.medicineImage) {
          setPreviewImage(data.medicineImage);
        }
      } catch (err) {
        toast.error("Failed to load medicine data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [_id, form]);

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
    setSubmitLoading(true); // ✅ start button spinner
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("Unauthorized! Login again.");

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
        manufactureDate: values.manufactureDate.toDate(),
        expiryDate: values.expiryDate.toDate(),
      };

      await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/medicine/${_id}`,
        payload,
        { headers: { Authorization: `${token}` } },
      );

      toast.success("Medicine updated successfully!");
      navigate("/pharmacist-dashboard/all-medicine");
    } catch (err) {
      toast.error("Failed to update medicine.");
    } finally {
      setSubmitLoading(false); // ✅ stop button spinner
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Loading medicine data..." size="large" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Medicine
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Medicine Name"
          name="name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Enter medicine name" />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: "Brand is required" }]}
        >
          <Input placeholder="Enter brand name" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Price is required" },
            { type: "number", min: 0, message: "Price must be positive" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            { required: true, message: "Stock is required" },
            { type: "number", min: 0, message: "Stock must be positive" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

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

        <Form.Item
          label="Manufacture Date"
          name="manufactureDate"
          rules={[{ required: true, message: "Manufacture date is required" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) => current && current > dayjs()}
          />
        </Form.Item>

        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[{ required: true, message: "Expiry date is required" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) => current && current < dayjs()}
          />
        </Form.Item>

        <Form.Item
          label="Medicine Image"
          valuePropName="fileList"
          getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        {previewImage && (
          <div className="mb-4 text-center">
            <Image src={previewImage} alt="Preview" width={150} />
          </div>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={submitLoading}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateMedicine;
