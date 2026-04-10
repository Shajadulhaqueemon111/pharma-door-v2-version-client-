/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Form, Input, Button, Spin, Typography } from "antd";

const { Title } = Typography;

type OfferProduct = {
  _id: string;
  name: string;
  brand: string;
  generic: string;
  category: string;
  dosage: string;
  form: string;
  price: string;
  medicineImage: string;
  offerPercent: string;
  stock_quantity: string;
};

const UpdateOfferPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<OfferProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://pharma-door-backend.vercel.app/api/v1/offer/${_id}`,
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (product) {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/offer/${_id}`,
        product,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      if (response.status === 200) {
        toast.success("Product updated successfully!");
        navigate("/pharmacist-dashboard/all-offer-medicine");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Update Offer Product
      </Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        {[
          "name",
          "brand",
          "generic",
          "category",
          "dosage",
          "form",
          "price",
          "medicineImage",
          "offerPercent",
          "stock_quantity",
        ].map((field) => (
          <Form.Item key={field} label={field.replace("_", " ").toUpperCase()}>
            <Input
              name={field}
              value={(product as any)[field]}
              onChange={handleChange}
            />
          </Form.Item>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateOfferPage;
