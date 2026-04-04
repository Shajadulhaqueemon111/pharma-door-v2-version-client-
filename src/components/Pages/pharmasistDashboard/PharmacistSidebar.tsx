import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  OrderedListOutlined,
  PercentageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../privateRoute/AuthContext";

const { Sider, Content, Header } = Layout;

interface AdminSidebarProps {
  children?: ReactNode;
}

const PharmacistSidebar = ({ children }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} width={240}>
        <div
          style={{
            padding: "16px",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Pharmacist Panel
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["2"]}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: <Link to="/">Home</Link>,
            },
            {
              key: "2",
              icon: <AppstoreOutlined />,
              label: <Link to="/pharmacist-dashboard">Dashboard</Link>,
            },
            {
              key: "3",
              icon: <InboxOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/all-medicine">
                  All Medicine
                </Link>
              ),
            },
            {
              key: "4",
              icon: <ClockCircleOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/expire-medicines">
                  Expire Medicines
                </Link>
              ),
            },
            {
              key: "5",
              icon: <WarningOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/pre-expire-medicine">
                  Pre-Expire Medicines
                </Link>
              ),
            },
            {
              key: "6",
              icon: <OrderedListOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/create-medicine">
                  Create Medicines
                </Link>
              ),
            },
            {
              key: "7",
              icon: <OrderedListOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/orderd-medicine">
                  Ordered Medicines
                </Link>
              ),
            },
            {
              key: "8",
              icon: <InboxOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/all-equipment">
                  All Equipment
                </Link>
              ),
            },
            {
              key: "9",
              icon: <PercentageOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/create-offer-medicine">
                  Create Offer Medicine
                </Link>
              ),
            },
            {
              key: "10",
              icon: <InboxOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/all-offer-medicine">
                  All Offer Medicine
                </Link>
              ),
            },
            {
              key: "11",
              icon: <AppstoreOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/create-equipment">
                  Create Equipment
                </Link>
              ),
            },
            {
              key: "12",
              icon: <AppstoreOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/create-blog">Create Blog</Link>
              ),
            },
            {
              key: "13",
              icon: <AppstoreOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/all-animal-medicine">
                  All Animal Medicine
                </Link>
              ),
            },
            {
              key: "14",
              icon: <AppstoreOutlined />,
              label: (
                <Link to="/pharmacist-dashboard/create-animal-medicine">
                  Create Animal Medicine
                </Link>
              ),
            },
            {
              key: "15",
              icon: <LogoutOutlined />,
              label: <span onClick={handleLogout}>Logout</span>,
            },
          ]}
        />
      </Sider>

      {/* Right Side */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: "16px",
            background: "#f5f5f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PharmacistSidebar;
