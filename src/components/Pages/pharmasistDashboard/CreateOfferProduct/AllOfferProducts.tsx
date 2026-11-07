/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../../../config/api";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Avatar,
  Space,
  Typography,
  Tooltip,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PercentageOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  TagOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { usePharmacistTheme } from "../pharmacistTheme";

const { Title, Text } = Typography;

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

const AllOfferProducts = () => {
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const { themeConfig } = usePharmacistTheme();

  const fetchOfferProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/offer`,
      );
      setOfferProducts(response.data?.data || []);
    } catch (err) {
      toast.error("Failed to retrieve offer products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferProduct();
  }, []);

  const handleDelete = async (_id: any) => {
    const result = await Swal.fire({
      title: "Delete Promotional Offer?",
      text: "This discount deal will be removed from the store front.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete deal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
          `${API_BASE_URL}/api/v1/offer/${_id}`,
          { headers: { Authorization: `${token}` } },
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("Offer product deleted successfully!");
          setOfferProducts((prev) => prev.filter((prod) => prod._id !== _id));
        }
      } catch (err) {
        toast.error("Failed to delete offer deal.");
      }
    }
  };

  const filteredDeals = useMemo(() => {
    return offerProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.generic?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [offerProducts, searchText]);

  // Stats
  const totalOffers = offerProducts.length;
  const maxDiscount = offerProducts.reduce(
    (max, p) => Math.max(max, Number(p.offerPercent) || 0),
    0,
  );
  const totalUnits = offerProducts.reduce(
    (sum, p) => sum + (Number(p.stock_quantity) || 0),
    0,
  );

  const columns: ColumnsType<OfferProduct> = [
    {
      title: "Promotional Product",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={52}
            src={record.medicineImage}
            icon={<MedicineBoxOutlined />}
            className="rounded-xl border border-pink-200 bg-pink-50 object-cover shrink-0"
          />
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
            </Text>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">{record.brand}</span>
              {record.form && (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">
                  {record.form}
                </span>
              )}
            </div>
            {record.generic && (
              <span className="text-[11px] text-slate-400 italic block mt-0.5">
                Generic: {record.generic}
              </span>
            )}
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Discount Offer",
      dataIndex: "offerPercent",
      key: "offerPercent",
      render: (percent) => (
        <Tag color="magenta" className="font-extrabold text-xs rounded-full px-3 py-0.5 shadow-xs">
          {percent}% OFF
        </Tag>
      ),
      sorter: (a, b) => Number(a.offerPercent) - Number(b.offerPercent),
    },
    {
      title: "Regular Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="text-xs line-through text-slate-400">৳ {Number(price || 0).toFixed(2)}</span>,
      sorter: (a, b) => Number(a.price) - Number(b.price),
    },
    {
      title: "Deal Price",
      key: "dealPrice",
      render: (_, record) => {
        const regular = Number(record.price) || 0;
        const disc = Number(record.offerPercent) || 0;
        const deal = regular - (regular * disc) / 100;
        return <span className="font-extrabold text-sm text-emerald-600">৳ {deal.toFixed(2)}</span>;
      },
    },
    {
      title: "Stock Units",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      render: (stock) => <span className="font-bold text-xs text-slate-700">{stock} Units</span>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Update Promotional Offer">
            <Link to={`/pharmacist-dashboard/update-offer-page/${record._id}`}>
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                style={{
                  backgroundColor: themeConfig.accentColor,
                  borderColor: themeConfig.accentColor,
                }}
              >
                Update
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete this promotional offer?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Special Offers & Discount Promotions
            </Title>
            <Tag color="magenta" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Deals Desk
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Configure promotional percentage discounts for healthcare products and over-the-counter wellness.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOfferProduct}
            loading={loading}
            className="rounded-xl font-semibold"
          >
            Refresh
          </Button>

          <Link to="/pharmacist-dashboard/create-offer-medicine">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                backgroundColor: themeConfig.accentColor,
                borderColor: themeConfig.accentColor,
                borderRadius: 12,
                fontWeight: 700,
              }}
              className="shadow-md"
            >
              Create Offer Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Active Discount Offers</span>}
              value={totalOffers}
              prefix={<GiftOutlined className="text-pink-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#db2777" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Published to consumer deal banner</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Max Active Discount</span>}
              value={maxDiscount}
              suffix="%"
              prefix={<PercentageOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-semibold">Highest consumer markdown</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Discounted Stock Quantity</span>}
              value={totalUnits}
              prefix={<TagOutlined style={{ color: themeConfig.accentColor }} className="mr-2" />}
              valueStyle={{ fontWeight: 800, color: themeConfig.accentColor }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total units available in flash promotion</div>
          </Card>
        </Col>
      </Row>

      {/* Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search deals by medicine name, brand, or generic..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading promotional products...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredDeals}
            rowKey="_id"
            pagination={{
              pageSize: 6,
              showSizeChanger: true,
              pageSizeOptions: ["6", "12", "24"],
              showTotal: (total) => `Total ${total} deals`,
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </div>
  );
};

export default AllOfferProducts;
