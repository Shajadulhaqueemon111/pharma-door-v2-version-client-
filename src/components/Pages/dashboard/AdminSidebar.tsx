import { type ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiGrid, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { AiFillMedicineBox } from "react-icons/ai";
import { Verified } from "lucide-react";
import { useAuth } from "../privateRoute/AuthContext";

interface AdminSidebarProps {
  children?: ReactNode;
}

const AdminSidebar = ({ children }: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarLinks = [
    { to: "/", icon: <FiHome />, label: "Home", exact: true },
    { to: "/admin-dashboard", icon: <FiGrid />, label: "Dashboard" },
    {
      to: "/admin-dashboard/all-users",
      icon: <FiUser />,
      label: "All Users",
    },
    {
      to: "/admin-dashboard/all-pharmacist",
      icon: <AiFillMedicineBox />,
      label: "Total Pharmacist",
    },
    {
      to: "/admin-dashboard/all-document",
      icon: <Verified className="text-indigo-500" />,
      label: "Document Verification",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block fixed top-0 left-0 h-screen w-64 z-50 bg-white border-r border-gray-200 p-6 transition-all duration-300 shadow-md`}
      >
        <h2 className="text-2xl font-bold mb-10 text-center tracking-wide text-indigo-700">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.label}
              to={link.to}
              icon={link.icon}
              label={link.label}
              exact={link.exact}
            />
          ))}
          <SidebarLink
            icon={<FiLogOut />}
            label="Logout"
            onClick={handleLogout}
          />
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          className="text-white bg-indigo-700 hover:bg-indigo-800 p-2 rounded-md shadow-md transition"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 min-h-screen text-black">
        {children}
      </main>
    </div>
  );
};

interface SidebarLinkProps {
  to?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  exact?: boolean;
}

const SidebarLink = ({
  to,
  icon,
  label,
  onClick,
  exact = false,
}: SidebarLinkProps) => {
  const location = useLocation();
  const isActive =
    to && (exact ? location.pathname === to : location.pathname.startsWith(to));

  const baseClasses =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 text-sm font-medium";
  const activeClasses = "bg-indigo-100 text-indigo-700 font-semibold";
  const inactiveClasses =
    "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${inactiveClasses} w-full text-left`}
      >
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      to={to || "#"}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default AdminSidebar;
