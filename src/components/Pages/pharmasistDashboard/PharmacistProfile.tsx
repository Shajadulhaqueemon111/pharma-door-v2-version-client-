/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "../privateRoute/AuthContext";
import axios from "axios";
import {
  Layout,
  Menu,
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Switch,
  Card,
  Divider,
  Tag,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  KeyOutlined,
  BgColorsOutlined,
  DesktopOutlined,
  LogoutOutlined,
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GlobalOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const inputStyle: React.CSSProperties = {
  background: "#161b22",
  border: "1px solid #30363d",
  color: "#e6edf3",
  borderRadius: 6,
};

const cardStyle: React.CSSProperties = {
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: 8,
};

// ══════════════════════════════════════════════════════════
// TAB 1 — PROFILE
// ══════════════════════════════════════════════════════════
const ProfileTab = ({ user, updateUser }: { user: any; updateUser: any }) => {
  const [profileImage, setProfileImage] = useState<string>(
    user?.profileImage || "",
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData,
      );
      setProfileImage(res.data.data.display_url);
      message.success("Image uploaded successfully!");
    } catch {
      message.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.patch(
        `https://pharma-door-backend.vercel.app/api/v1/users/${user?._id}`,
        { ...values, profileImage },
        { headers: { Authorization: `${token}` } },
      );
      if (res.data) {
        message.success("Profile updated successfully!");
        updateUser(res.data.user);
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={4} style={{ color: "#e6edf3", margin: 0 }}>
        Profile
      </Title>
      <Text style={{ color: "#8b949e", fontSize: 13 }}>
        Update your profile information.
      </Text>
      <Divider style={{ borderColor: "#21262d", margin: "16px 0 28px 0" }} />

      <Form
        layout="vertical"
        initialValues={{ name: user?.name, email: user?.email }}
        onFinish={handleUpdate}
        style={{ maxWidth: 580 }}
      >
        {/* Profile Picture */}
        <div style={{ marginBottom: 28 }}>
          <Text
            style={{
              color: "#e6edf3",
              fontWeight: 600,
              fontSize: 14,
              display: "block",
              marginBottom: 12,
            }}
          >
            Profile Picture
          </Text>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 8,
                background: "#21262d",
                border: "1px solid #30363d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <UserOutlined style={{ fontSize: 56, color: "#8b949e" }} />
              )}
            </div>
            <button
              type="button"
              onClick={() => setProfileImage("")}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                background: "#30363d",
                border: "none",
                borderRadius: "50%",
                width: 22,
                height: 22,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e6edf3",
              }}
            >
              <CloseOutlined style={{ fontSize: 10 }} />
            </button>
          </div>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false;
            }}
          >
            <Button
              loading={uploadingImage}
              size="small"
              style={{
                display: "block",
                marginTop: 10,
                background: "#21262d",
                border: "1px solid #30363d",
                color: "#e6edf3",
                borderRadius: 6,
              }}
            >
              {uploadingImage ? "Uploading..." : "Change Photo"}
            </Button>
          </Upload>
        </div>

        {/* Name + Username */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={<span style={{ color: "#e6edf3" }}>Name</span>}
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input style={inputStyle} placeholder="Enter your name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ color: "#e6edf3" }}>User Name</span>}
            >
              <Input
                style={inputStyle}
                defaultValue={user?.username || ""}
                placeholder="Username"
              />
            </Form.Item>
          </Col>
        </Row>
        <Text
          style={{
            color: "#8b949e",
            fontSize: 12,
            display: "block",
            marginTop: -16,
            marginBottom: 20,
          }}
        >
          Your name will be displayed publicly. You can change this any time.
        </Text>

        {/* Email */}
        <Form.Item
          name="email"
          label={<span style={{ color: "#e6edf3" }}>Email</span>}
        >
          <Input style={{ ...inputStyle, color: "#8b949e" }} disabled />
        </Form.Item>
        <Text
          style={{
            color: "#8b949e",
            fontSize: 12,
            display: "block",
            marginTop: -16,
            marginBottom: 20,
          }}
        >
          You cannot change your email address.
        </Text>

        {/* Mobile */}
        <Form.Item
          name="phone"
          label={<span style={{ color: "#e6edf3" }}>Mobile Number</span>}
        >
          <Input
            style={inputStyle}
            prefix={<span style={{ fontSize: 16 }}>🇧🇩</span>}
            placeholder="+880 XXXX XXXXXX"
          />
        </Form.Item>
        <Text
          style={{
            color: "#8b949e",
            fontSize: 12,
            display: "block",
            marginTop: -16,
            marginBottom: 28,
          }}
        >
          Your mobile number is used for account recovery and security.
        </Text>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              background: "#1a7fd4",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              height: 38,
              padding: "0 28px",
            }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// TAB 2 — ACCOUNT
// ══════════════════════════════════════════════════════════
const AccountTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<"agency" | "security">(
    "security",
  );
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div>
      <Text style={{ color: "#8b949e", fontSize: 13 }}>
        Manage your account settings, including your Agency information and
        security settings.
      </Text>

      <div style={{ display: "flex", gap: 8, margin: "20px 0 28px 0" }}>
        {(["agency", "security"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            style={{
              background: activeSubTab === tab ? "#1a7fd4" : "transparent",
              border:
                activeSubTab === tab
                  ? "1px solid #1a7fd4"
                  : "1px solid #30363d",
              borderRadius: 6,
              color: "#e6edf3",
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {tab === "agency" ? <GlobalOutlined /> : <KeyOutlined />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeSubTab === "security" && (
        <div style={{ maxWidth: 640 }}>
          <Card style={cardStyle} styles={{ body: { padding: 24 } }}>
            <Title level={5} style={{ color: "#e6edf3", margin: "0 0 4px 0" }}>
              Security Settings
            </Title>
            <Text style={{ color: "#8b949e", fontSize: 13 }}>
              Make changes to your security settings here.
            </Text>
            <div style={{ marginTop: 24 }}>
              {[
                {
                  label: "Current Password",
                  desc: "This is your current password.",
                  placeholder: "Current password",
                },
                {
                  label: "New Password",
                  desc: "This is your new password.",
                  placeholder: "New password",
                },
                {
                  label: "Confirm Password",
                  desc: "Please confirm your new password.",
                  placeholder: "Confirm password",
                },
              ].map((item, i) => (
                <Row key={i} align="top" style={{ marginBottom: 20 }}>
                  <Col span={10}>
                    <Text
                      style={{
                        color: "#e6edf3",
                        fontWeight: 600,
                        fontSize: 13,
                        display: "block",
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text style={{ color: "#8b949e", fontSize: 12 }}>
                      {item.desc}
                    </Text>
                  </Col>
                  <Col span={14}>
                    <Input.Password
                      placeholder={item.placeholder}
                      style={inputStyle}
                      iconRender={(visible) =>
                        visible ? (
                          <EyeTwoTone twoToneColor="#8b949e" />
                        ) : (
                          <EyeInvisibleOutlined style={{ color: "#8b949e" }} />
                        )
                      }
                    />
                  </Col>
                </Row>
              ))}
            </div>
            <Button
              style={{
                background: "#21262d",
                border: "1px solid #30363d",
                color: "#e6edf3",
                borderRadius: 6,
              }}
            >
              Save changes
            </Button>
          </Card>

          <Card
            style={{ ...cardStyle, marginTop: 16 }}
            styles={{ body: { padding: 24 } }}
          >
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 12 }}
            >
              <Col>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#3fb950",
                      boxShadow: "0 0 6px #3fb950",
                    }}
                  />
                  <Text style={{ color: "#e6edf3", fontWeight: 600 }}>
                    Two-Factor Authentication (2FA)
                  </Text>
                </div>
                <Text style={{ color: "#8b949e", fontSize: 12 }}>
                  Protect your account with an additional verification step when
                  signing in.
                </Text>
              </Col>
              <Col>
                <Switch
                  checked={twoFA}
                  onChange={setTwoFA}
                  style={{ background: twoFA ? "#1a7fd4" : "#30363d" }}
                />
              </Col>
            </Row>
            <div
              style={{
                background: "rgba(248,81,73,0.12)",
                border: "1px solid rgba(248,81,73,0.3)",
                borderRadius: 6,
                padding: "10px 14px",
                display: "flex",
                gap: 8,
              }}
            >
              <span style={{ color: "#f85149", fontSize: 16 }}>⊙</span>
              <div>
                <Text
                  style={{
                    color: "#f85149",
                    fontWeight: 600,
                    fontSize: 13,
                    display: "block",
                  }}
                >
                  Recommended
                </Text>
                <Text style={{ color: "#f85149", fontSize: 12 }}>
                  We strongly recommend enabling two-factor authentication for
                  enhanced account security.
                </Text>
              </div>
            </div>
          </Card>
        </div>
      )}
      {activeSubTab === "agency" && (
        <Text style={{ color: "#8b949e" }}>Agency settings coming soon...</Text>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// TAB 3 — APPEARANCE
// ══════════════════════════════════════════════════════════
const AppearanceTab = () => {
  const [selectedMode, setSelectedMode] = useState("dark");
  const [selectedColor, setSelectedColor] = useState("default");
  const [scaled, setScaled] = useState(false);

  const modes = [
    {
      key: "light",
      label: "Light",
      preview: (
        <div
          style={{
            background: "#f0f0f0",
            borderRadius: 4,
            padding: 8,
            width: 100,
          }}
        >
          {[80, 60, 60, 40].map((w, i) => (
            <div
              key={i}
              style={{
                background: "#ccc",
                borderRadius: 2,
                height: 6,
                width: `${w}%`,
                marginBottom: i < 3 ? 5 : 0,
              }}
            />
          ))}
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#aaa",
              }}
            />
            <div style={{ flex: 1, background: "#ddd", borderRadius: 2 }} />
          </div>
        </div>
      ),
    },
    {
      key: "dark",
      label: "Dark",
      preview: (
        <div
          style={{
            background: "#1c2128",
            borderRadius: 4,
            padding: 8,
            width: 100,
          }}
        >
          {[80, 60, 60].map((w, i) => (
            <div
              key={i}
              style={{
                background: "#444",
                borderRadius: 2,
                height: 6,
                width: `${w}%`,
                marginBottom: 5,
              }}
            />
          ))}
          <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#1a7fd4",
              }}
            />
            <div style={{ flex: 1, background: "#333", borderRadius: 2 }} />
          </div>
        </div>
      ),
    },
  ];

  const colorThemes = [
    { key: "default", color: "#1a7fd4" },
    { key: "red", color: "#f85149" },
    { key: "blue2", color: "#388bfd" },
  ];

  return (
    <div>
      <Title level={4} style={{ color: "#e6edf3", margin: 0 }}>
        Appearance
      </Title>
      <Text style={{ color: "#8b949e", fontSize: 13 }}>
        Customize the appearance of the app. Automatically switch between day
        and night themes.
      </Text>
      <Divider style={{ borderColor: "#21262d", margin: "16px 0 28px 0" }} />

      <div style={{ marginBottom: 32 }}>
        <Text
          style={{
            color: "#e6edf3",
            fontWeight: 600,
            fontSize: 14,
            display: "block",
            marginBottom: 4,
          }}
        >
          Mode
        </Text>
        <Text
          style={{
            color: "#8b949e",
            fontSize: 13,
            display: "block",
            marginBottom: 16,
          }}
        >
          Choose between light and dark mode.
        </Text>
        <div style={{ display: "flex", gap: 20 }}>
          {modes.map((m) => (
            <div
              key={m.key}
              onClick={() => setSelectedMode(m.key)}
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  border:
                    selectedMode === m.key
                      ? "2px solid #1a7fd4"
                      : "2px solid #30363d",
                  borderRadius: 8,
                  padding: 8,
                  background: "#161b22",
                  transition: "border-color 0.2s",
                }}
              >
                {m.preview}
              </div>
              <Text style={{ color: "#e6edf3", fontSize: 13 }}>{m.label}</Text>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Text
          style={{
            color: "#e6edf3",
            fontWeight: 600,
            fontSize: 14,
            display: "block",
            marginBottom: 4,
          }}
        >
          Theme Color
        </Text>
        <Text
          style={{
            color: "#8b949e",
            fontSize: 13,
            display: "block",
            marginBottom: 16,
          }}
        >
          Select the base color for your theme.
        </Text>
        <div style={{ display: "flex", gap: 16 }}>
          {colorThemes.map((ct) => (
            <div
              key={ct.key}
              onClick={() => setSelectedColor(ct.key)}
              style={{
                cursor: "pointer",
                border:
                  selectedColor === ct.key
                    ? `2px solid ${ct.color}`
                    : "2px solid #30363d",
                borderRadius: 8,
                padding: 10,
                background: "#161b22",
                width: 110,
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  background: "#21262d",
                  borderRadius: 4,
                  padding: "6px 8px",
                }}
              >
                <div
                  style={{
                    background: ct.color,
                    borderRadius: 2,
                    height: 6,
                    width: "70%",
                    marginBottom: 5,
                  }}
                />
                <div
                  style={{
                    background: ct.color + "88",
                    borderRadius: 2,
                    height: 6,
                    width: "90%",
                    marginBottom: 5,
                  }}
                />
                <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: ct.color,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      background: ct.color + "44",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card style={cardStyle} styles={{ body: { padding: 16 } }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: "#e6edf3", fontWeight: 600 }}>
              Scaled Theme
            </Text>
            <br />
            <Text style={{ color: "#8b949e", fontSize: 12 }}>
              Choose between regular and scaled theme.
            </Text>
          </Col>
          <Col>
            <Switch
              checked={scaled}
              onChange={setScaled}
              style={{ background: scaled ? "#1a7fd4" : "#30363d" }}
            />
          </Col>
        </Row>
      </Card>

      <Button
        type="primary"
        style={{
          background: "#1a7fd4",
          border: "none",
          borderRadius: 6,
          fontWeight: 600,
          height: 38,
          padding: "0 28px",
          marginTop: 24,
        }}
      >
        Save Theme Preferences
      </Button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// TAB 4 — SESSIONS
// ══════════════════════════════════════════════════════════
const SessionsTab = () => {
  const sessions = [
    {
      browser: "Chrome",
      ip: "43.204.144.227",
      lastActive: "Apr 05, 2026 at 10:38 AM",
      created: "Apr 05, 2026 at 10:37 AM",
      current: true,
    },
    {
      browser: "Chrome",
      ip: "3.110.99.93",
      lastActive: "Apr 05, 2026 at 10:17 AM",
      created: "Apr 05, 2026 at 10:17 AM",
      current: false,
    },
    {
      browser: "Chrome",
      ip: "13.235.74.128",
      lastActive: "Apr 02, 2026 at 02:25 PM",
      created: "Apr 02, 2026 at 10:59 AM",
      current: false,
    },
    {
      browser: "Chrome",
      ip: "13.205.18.58",
      lastActive: "Apr 02, 2026 at 04:54 PM",
      created: "Apr 02, 2026 at 10:44 AM",
      current: false,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ color: "#e6edf3", margin: 0 }}>
        Sessions
      </Title>
      <Text style={{ color: "#8b949e", fontSize: 13 }}>
        Manage and monitor your active sessions across all devices.
      </Text>
      <Divider style={{ borderColor: "#21262d", margin: "16px 0 28px 0" }} />

      <Card style={cardStyle} styles={{ body: { padding: 24 } }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Title level={5} style={{ color: "#e6edf3", margin: "0 0 4px 0" }}>
              Active Sessions
            </Title>
            <Text style={{ color: "#8b949e", fontSize: 12 }}>
              Manage your active sessions across all devices. You can log out of
              individual sessions or all sessions at once.
            </Text>
          </Col>
          <Col>
            <Button
              danger
              icon={<LogoutOutlined />}
              style={{
                background: "#da3633",
                border: "none",
                color: "#fff",
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              Logout All Sessions
            </Button>
          </Col>
        </Row>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sessions.map((s, i) => (
            <div
              key={i}
              style={{
                background: s.current ? "rgba(26,127,212,0.08)" : "#0f1117",
                border: s.current
                  ? "1px solid rgba(26,127,212,0.3)"
                  : "1px solid #21262d",
                borderRadius: 8,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <DesktopOutlined style={{ fontSize: 22, color: "#8b949e" }} />
                <div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text style={{ color: "#e6edf3", fontWeight: 600 }}>
                      {s.browser}
                    </Text>
                    {s.current && (
                      <Tag
                        color="blue"
                        style={{
                          fontSize: 11,
                          padding: "0 6px",
                          borderRadius: 4,
                        }}
                      >
                        Current session
                      </Tag>
                    )}
                  </div>
                  <Text
                    style={{ color: "#8b949e", fontSize: 12, display: "block" }}
                  >
                    IP: {s.ip}
                  </Text>
                  <Text
                    style={{ color: "#8b949e", fontSize: 12, display: "block" }}
                  >
                    Last active: {s.lastActive}
                  </Text>
                  <Text
                    style={{ color: "#8b949e", fontSize: 12, display: "block" }}
                  >
                    Created: {s.created}
                  </Text>
                </div>
              </div>
              {!s.current && (
                <Button
                  type="text"
                  icon={
                    <LogoutOutlined
                      style={{ color: "#da3633", fontSize: 16 }}
                    />
                  }
                  style={{ background: "transparent", border: "none" }}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN — PharmacistProfile
// ══════════════════════════════════════════════════════════
const PharmacistProfile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "account", icon: <KeyOutlined />, label: "Account" },
    { key: "appearance", icon: <BgColorsOutlined />, label: "Appearance" },
    { key: "sessions", icon: <DesktopOutlined />, label: "Sessions" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} updateUser={updateUser} />;
      case "account":
        return <AccountTab />;
      case "appearance":
        return <AppearanceTab />;
      case "sessions":
        return <SessionsTab />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: "#0f1117",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ padding: "28px 40px 8px 40px" }}>
        <Title level={3} style={{ color: "#e6edf3", margin: 0 }}>
          Settings
        </Title>
        <Text style={{ color: "#8b949e", fontSize: 13 }}>
          Manage your account settings, preferences, and configurations here.
        </Text>
      </div>

      <Layout
        style={{ background: "transparent", minHeight: "calc(100vh - 90px)" }}
      >
        {/* Sidebar */}
        <Sider
          width={200}
          style={{
            background: "#161b22",
            borderRight: "1px solid #21262d",
            padding: "24px 0",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
            style={{ background: "transparent", border: "none" }}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
              style: {
                color: activeTab === item.key ? "#e6edf3" : "#8b949e",
                background:
                  activeTab === item.key
                    ? "rgba(26,127,212,0.15)"
                    : "transparent",
                borderLeft:
                  activeTab === item.key
                    ? "3px solid #1a7fd4"
                    : "3px solid transparent",
                borderRadius: 0,
              },
            }))}
          />
        </Sider>

        {/* Content */}
        <Content
          style={{
            background: "#0f1117",
            padding: "32px 40px",
            minHeight: "100vh",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>

      <style>{`
        .ant-menu-item:hover { background: rgba(255,255,255,0.04) !important; color: #e6edf3 !important; }
        .ant-menu-item-selected { background: rgba(26,127,212,0.15) !important; color: #e6edf3 !important; }
        .ant-input, .ant-input-affix-wrapper {
          background: #161b22 !important; border-color: #30363d !important; color: #e6edf3 !important;
        }
        .ant-input:focus, .ant-input-affix-wrapper-focused {
          border-color: #1a7fd4 !important; box-shadow: 0 0 0 2px rgba(26,127,212,0.2) !important;
        }
        .ant-input::placeholder { color: #484f58 !important; }
        .ant-input-password .ant-input { background: transparent !important; }
        .ant-form-item-label > label { color: #e6edf3 !important; font-size: 13px !important; }
        .ant-card { background: #161b22 !important; }
      `}</style>
    </div>
  );
};

export default PharmacistProfile;
