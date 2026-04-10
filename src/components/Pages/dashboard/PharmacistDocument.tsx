/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Table,
  Input,
  Button,
  Modal,
  Image,
  Spin,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  FileZipOutlined,
} from "@ant-design/icons";

import JSZip from "jszip";
import { saveAs } from "file-saver";

type PharmacistType = {
  _id: string;
  user: string;
  name: string;
  address: string;
  storeName: string;
  phone: string;
  email: string;
  postCode: string;
  nid: string;
  nidImage: string;
  drugLicenseImage: string;
  tradeLicenseImage: string;
  status: string;
  createdAt: string;
};

const { Title } = Typography;

const PharmacistDocument = () => {
  const [pharmacists, setPharmacists] = useState<PharmacistType[]>([]);
  const [filtered, setFiltered] = useState<PharmacistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PharmacistType | null>(null);
  const [open, setOpen] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  // ================= FETCH =================
  const fetchPharmacists = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        "https://pharma-door-backend.vercel.app/api/v1/phermacist",
        {
          headers: { Authorization: `${token}` },
        },
      );

      setPharmacists(res.data.data);
      setFiltered(res.data.data);
    } catch (error) {
      toast.error("Failed to load pharmacists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // 400ms delay (pro level UX)

    return () => clearTimeout(handler);
  }, [search]);

  // ================= SEARCH =================
  useEffect(() => {
    const lower = debouncedSearch.toLowerCase().trim();

    // 🔥 Minimum 2 character rule
    if (lower.length < 2) {
      setFiltered(pharmacists);
      return;
    }

    const result = pharmacists.filter((item) => {
      return (
        item.name.toLowerCase().includes(lower) ||
        item.email.toLowerCase().includes(lower) ||
        item.phone.includes(lower) ||
        item.storeName.toLowerCase().includes(lower)
      );
    });

    setFiltered(result);
  }, [debouncedSearch, pharmacists]);

  // ================= SINGLE DOWNLOAD =================
  const downloadSingleFile = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      saveAs(blob, name);
    } catch {
      toast.error("Download failed");
    }
  };

  // ================= ZIP DOWNLOAD =================
  const downloadAllDocuments = async (user: PharmacistType) => {
    try {
      const zip = new JSZip();

      const files = [
        { url: user.nidImage, name: "NID.jpg" },
        { url: user.drugLicenseImage, name: "Drug-License.jpg" },
        { url: user.tradeLicenseImage, name: "Trade-License.jpg" },
      ];

      await Promise.all(
        files.map(async (file) => {
          const res = await fetch(file.url);
          const blob = await res.blob();
          zip.file(file.name, blob);
        }),
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${user.name}-documents.zip`);
    } catch {
      toast.error("ZIP download failed");
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Store",
      dataIndex: "storeName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      render: (_: any, record: PharmacistType) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelected(record);
            setOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={3}>Pharmacist Documents</Title>

      <Input
        placeholder="Search pharmacist..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <Table dataSource={filtered} columns={columns} rowKey="_id" bordered />

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
      >
        {selected && (
          <div>
            <Title level={4}>{selected.name}</Title>

            <p>
              <b>Email:</b> {selected.email}
            </p>
            <p>
              <b>Phone:</b> {selected.phone}
            </p>
            <p>
              <b>Store:</b> {selected.storeName}
            </p>
            <p>
              <b>Address:</b> {selected.address}
            </p>

            <Divider />

            {/* ZIP DOWNLOAD */}
            <Button
              type="primary"
              icon={<FileZipOutlined />}
              onClick={() => downloadAllDocuments(selected)}
              style={{ marginBottom: 15 }}
            >
              Download All (ZIP)
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* NID */}
              <div>
                <p className="font-semibold">NID</p>
                <Image src={selected.nidImage} />

                <Button
                  icon={<DownloadOutlined />}
                  block
                  onClick={() =>
                    downloadSingleFile(selected.nidImage, "NID.jpg")
                  }
                >
                  Download
                </Button>
              </div>

              {/* DRUG */}
              <div>
                <p className="font-semibold">Drug License</p>
                <Image src={selected.drugLicenseImage} />

                <Button
                  icon={<DownloadOutlined />}
                  block
                  onClick={() =>
                    downloadSingleFile(
                      selected.drugLicenseImage,
                      "Drug-License.jpg",
                    )
                  }
                >
                  Download
                </Button>
              </div>

              {/* TRADE */}
              <div>
                <p className="font-semibold">Trade License</p>
                <Image src={selected.tradeLicenseImage} />

                <Button
                  icon={<DownloadOutlined />}
                  block
                  onClick={() =>
                    downloadSingleFile(
                      selected.tradeLicenseImage,
                      "Trade-License.jpg",
                    )
                  }
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PharmacistDocument;
