import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Button } from "antd";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type DropdownItem = {
  label: string;
  sub: string;
  path: string;
  iconBg: string;
  iconStroke: string;
};

const DropdownMenu = ({
  open,
  items,
  onNavigate,
}: {
  open: boolean;
  items: DropdownItem[];
  onNavigate: (path: string) => void;
}) => {
  if (!open) return null;

  return (
    <div className="absolute top-[calc(100%+10px)] left-0 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 min-w-[200px] z-50">
      {items.map((item, i) => (
        <div key={item.path}>
          {i > 0 && <div className="h-px bg-gray-100 mx-3 my-1" />}
          <button
            onClick={() => onNavigate(item.path)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg mx-1.5 hover:bg-teal-50 transition-colors text-left group"
            style={{ width: "calc(100% - 12px)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: item.iconBg }}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 14 14"
                fill="none"
                stroke={item.iconStroke}
                strokeWidth={1.6}
              >
                {item.label === "Napa" && (
                  <>
                    <rect x="2" y="3" width="10" height="8" rx="2" />
                    <path d="M7 5v4M5 7h4" strokeLinecap="round" />
                  </>
                )}
                {item.label === "Seclo" && (
                  <>
                    <circle cx="7" cy="7" r="4" />
                    <path d="M3 7h8" strokeLinecap="round" />
                  </>
                )}
                {item.label === "Stethoscope" && (
                  <>
                    <circle cx="7" cy="10" r="3" />
                    <path d="M4 10V5a3 3 0 0 1 6 0v2" />
                    <circle cx="10" cy="7" r="1.2" fill={item.iconStroke} />
                  </>
                )}
                {item.label === "Thermometer" && (
                  <>
                    <rect x="5.5" y="1" width="3" height="9" rx="1.5" />
                    <path d="M7 10v2" />
                    <circle cx="7" cy="12" r="1" fill={item.iconStroke} />
                  </>
                )}
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700 transition-colors">
                {item.label}
              </p>
              <p className="text-[11px] text-gray-400">{item.sub}</p>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

const SecondNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const isPharmacist = user?.role === "pharmacist";

  const [medOpen, setMedOpen] = useState(false);
  const [eqOpen, setEqOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"med" | "eq" | null>(null);

  const medRef = useRef<HTMLDivElement>(null);
  const eqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (medRef.current && !medRef.current.contains(e.target as Node))
        setMedOpen(false);
      if (eqRef.current && !eqRef.current.contains(e.target as Node))
        setEqOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm px-3 py-2 rounded-lg transition-colors font-medium ${
      isActive(path)
        ? "text-teal-700 bg-teal-50"
        : "text-gray-500 hover:text-teal-700 hover:bg-teal-50"
    }`;

  const medicineItems: DropdownItem[] = [
    {
      label: "Napa",
      sub: "Paracetamol 500mg",
      path: "/medicines/napa",
      iconBg: "#E1F5EE",
      iconStroke: "#085041",
    },
    {
      label: "Seclo",
      sub: "Omeprazole 20mg",
      path: "/medicines/seclo",
      iconBg: "#E1F5EE",
      iconStroke: "#085041",
    },
  ];

  const equipmentItems: DropdownItem[] = [
    {
      label: "Stethoscope",
      sub: "Cardiology & more",
      path: "/equipments/stethoscope",
      iconBg: "#E6F1FB",
      iconStroke: "#0C447C",
    },
    {
      label: "Thermometer",
      sub: "Digital & infrared",
      path: "/equipments/thermometer",
      iconBg: "#FAEEDA",
      iconStroke: "#633806",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="white"
                strokeWidth={2}
              >
                <path d="M8 2v12M2 8h12" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-teal-800">
              MedStore
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex lg:items-center lg:gap-1 flex-1">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>

            {/* Medicines dropdown */}
            <div ref={medRef} className="relative">
              <button
                onClick={() => {
                  setMedOpen((p) => !p);
                  setEqOpen(false);
                }}
                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors font-medium
                  ${medOpen ? "text-teal-700 bg-teal-50" : "text-gray-500 hover:text-teal-700 hover:bg-teal-50"}`}
              >
                Medicines <ChevronIcon open={medOpen} />
              </button>
              <DropdownMenu
                open={medOpen}
                items={medicineItems}
                onNavigate={navigate}
              />
            </div>

            {/* Equipments dropdown */}
            <div ref={eqRef} className="relative">
              <button
                onClick={() => {
                  setEqOpen((p) => !p);
                  setMedOpen(false);
                }}
                className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors font-medium
                  ${eqOpen ? "text-teal-700 bg-teal-50" : "text-gray-500 hover:text-teal-700 hover:bg-teal-50"}`}
              >
                Equipments <ChevronIcon open={eqOpen} />
              </button>
              <DropdownMenu
                open={eqOpen}
                items={equipmentItems}
                onNavigate={navigate}
              />
            </div>

            <Link
              to="/products/all-products"
              className={navLinkClass("/products/all-products")}
            >
              All medicine
            </Link>
            <Link to="/contact-page" className={navLinkClass("/contact-page")}>
              Contact
            </Link>
            <Link
              to="/medicines/aboute"
              className={navLinkClass("/medicines/aboute")}
            >
              About
            </Link>
          </div>

          {/* ── Right side — Dashboard + Avatar ── */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className={navLinkClass("/admin-dashboard")}
              >
                Admin dashboard
              </Link>
            )}
            {isPharmacist && (
              <Link
                to="/pharmacist-dashboard"
                className={navLinkClass("/pharmacist-dashboard")}
              >
                <Button className=""> Pharmacist dashboard</Button>
              </Link>
            )}
            {/* {user && (
              <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-sm font-medium text-teal-700 cursor-pointer select-none">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            )} */}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="lg:hidden ml-auto w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? (
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors"
            >
              Home
            </Link>

            {/* Medicines accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileSection((p) => (p === "med" ? null : "med"))
                }
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 rounded-xl transition-colors"
              >
                Medicines <ChevronIcon open={mobileSection === "med"} />
              </button>
              {mobileSection === "med" && (
                <div className="ml-4 mt-1 space-y-1">
                  {medicineItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {item.label}
                      <span className="text-xs text-gray-400 ml-2">
                        {item.sub}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Equipments accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileSection((p) => (p === "eq" ? null : "eq"))
                }
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 rounded-xl transition-colors"
              >
                Equipments <ChevronIcon open={mobileSection === "eq"} />
              </button>
              {mobileSection === "eq" && (
                <div className="ml-4 mt-1 space-y-1">
                  {equipmentItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      {item.label}
                      <span className="text-xs text-gray-400 ml-2">
                        {item.sub}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/products/all-products"
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors"
            >
              All medicine
            </Link>
            <Link
              to="/contact-page"
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/medicines/aboute"
              className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl transition-colors"
            >
              About
            </Link>

            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className="block px-3 py-2.5 text-sm text-teal-700 font-medium hover:bg-teal-50 rounded-xl transition-colors"
              >
                Admin dashboard
              </Link>
            )}
            {isPharmacist && (
              <Link
                to="/pharmacist-dashboard"
                className="block px-3 py-2.5 text-sm text-teal-700 font-medium hover:bg-teal-50 rounded-xl transition-colors"
              >
                Pharmacist dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SecondNavbar;
