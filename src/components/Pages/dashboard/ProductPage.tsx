/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Avatar,
  Typography,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  AppstoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ProductPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      // Attempt to load products from API or fallback to medicine list
      const response = await axios
        .get(`${API_BASE_URL}/api/v1/medicine`, {
          headers: token ? { Authorization: `${token}` } : {},
        })
        .catch(async () => {
          return await axios.get(`${API_BASE_URL}/api/products`);
        });

      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = searchText.toLowerCase();
      return (
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    });
  }, [products, searchText]);

  const totalCount = products.length;
  const inStockCount = products.filter((p) => (Number(p.stock) || 0) > 10).length;
  const lowStockCount = products.filter((p) => (Number(p.stock) || 0) <= 10).length;

  const columns: ColumnsType<any> = [
    {
      title: "Product",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            shape="square"
            size={50}
            src={record.medicineImage || record.image}
            icon={<MedicineBoxOutlined />}
            className="rounded-xl border border-slate-200 bg-slate-50 object-cover shrink-0"
          />
          <div>
            <Text strong className="text-slate-900 text-sm block">
              {record.name}
            </Text>
            <span className="text-xs text-slate-400 block font-medium">
              {record.brand || record.manufacturer || "General"}
            </span>
          </div>
        </div>
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat, record) => (
        <Tag color="cyan" className="rounded font-semibold text-xs px-2">
          {cat || record.medicineType || "Medicine"}
        </Tag>
      ),
    },
    {
      title: "Retail Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-bold text-slate-900 text-sm">৳ {(Number(price) || 0).toFixed(2)}</span>,
      sorter: (a, b) => Number(a.price) - Number(b.price),
    },
    {
      title: "Stock Status",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => {
        const qty = Number(stock) || 0;
        return qty > 10 ? (
          <Tag color="success" className="font-bold rounded-full px-2.5">In Stock ({qty})</Tag>
        ) : (
          <Tag color="warning" className="font-bold rounded-full px-2.5">Low Stock ({qty})</Tag>
        );
      },
      sorter: (a, b) => Number(a.stock) - Number(b.stock),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Global Product Catalog
            </Title>
            <Tag color="blue" className="font-extrabold rounded-full px-2 py-0.5 text-xs">
              Inventory Master
            </Tag>
          </div>
          <Text type="secondary" className="text-xs sm:text-sm">
            Overview of all catalog items, drugs, medical products, and diagnostics in system database.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchProducts}
            loading={loading}
            className="rounded-xl font-semibold"
          >
            Refresh
          </Button>

          <Link to="/admin-dashboard/create-product">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ backgroundColor: "#0d9488", borderColor: "#0d9488" }}
              className="rounded-xl font-bold shadow-md"
            >
              Create Master Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Master Products</span>}
              value={totalCount}
              prefix={<AppstoreOutlined className="text-teal-600 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#0f172a" }}
            />
            <div className="mt-2 text-[11px] text-slate-400">Total cataloged items</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Adequate Stock</span>}
              value={inStockCount}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#10b981" }}
            />
            <div className="mt-2 text-[11px] text-emerald-600 font-medium">Ready for distribution</div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-xs rounded-2xl">
            <Statistic
              title={<span className="text-xs font-bold text-slate-500 uppercase">Low Stock Alert</span>}
              value={lowStockCount}
              prefix={<WarningOutlined className="text-amber-500 mr-2" />}
              valueStyle={{ fontWeight: 800, color: "#f59e0b" }}
            />
            <div className="mt-2 text-[11px] text-amber-600 font-semibold">Under 10 units</div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-xs rounded-2xl overflow-hidden border border-slate-200/70">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-3">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder="Search catalog by product name, category, or manufacturer..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md rounded-xl"
          />
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-3">
            <Spin size="large" />
            <Text type="secondary" className="text-xs">Loading product catalog...</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey={(r) => r._id || r.id}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "16", "32"],
              showTotal: (total) => `Total ${total} products`,
            }}
            scroll={{ x: 700 }}
          />
        )}
      </Card>
    </div>
  );
};

export default ProductPage;
