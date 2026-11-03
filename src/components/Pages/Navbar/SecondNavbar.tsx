import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Pill, Activity, Stethoscope, Thermometer, Sparkles, Shield, UserCheck, Menu, X } from "lucide-react";

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M2.5 4.5l3.5 3.5 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type DropdownItem = {
  label: string;
  sub: string;
  path: string;
  icon: React.ReactNode;
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
    <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 min-w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
      {items.map((item, i) => (
        <div key={item.path}>
          {i > 0 && <div className="h-px bg-slate-100 mx-3 my-1" />}
          <button
            onClick={() => onNavigate(item.path)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl mx-1.5 hover:bg-teal-50 transition-colors text-left group w-[calc(100%-12px)] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                {item.label}
              </p>
              <p className="text-[11px] text-slate-400">{item.sub}</p>
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
    `text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-all font-medium ${
      isActive(path)
        ? "text-teal-700 bg-teal-50/80 font-semibold shadow-2xs"
        : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"
    }`;

  const medicineItems: DropdownItem[] = [
    {
      label: "Napa Series",
      sub: "Paracetamol 500mg & Rapid",
      path: "/medicines/napa",
      icon: <Pill size={16} />,
    },
    {
      label: "Seclo Series",
      sub: "Omeprazole 20mg / Capsule",
      path: "/medicines/seclo",
      icon: <Activity size={16} />,
    },
  ];

  const equipmentItems: DropdownItem[] = [
    {
      label: "Stethoscope",
      sub: "Cardiology & Diagnostic",
      path: "/equipments/stethoscope",
      icon: <Stethoscope size={16} />,
    },
    {
      label: "Thermometer",
      sub: "Digital & Infrared Laser",
      path: "/equipments/thermometer",
      icon: <Thermometer size={16} />,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* ── Desktop Category links ── */}
          <div className="hidden lg:flex items-center gap-1">
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
                className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer
                  ${medOpen || location.pathname.startsWith("/medicines/") ? "text-teal-700 bg-teal-50/80 font-semibold" : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"}`}
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
                className={`flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer
                  ${eqOpen || location.pathname.startsWith("/equipments/") ? "text-teal-700 bg-teal-50/80 font-semibold" : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"}`}
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
              All Medicines
            </Link>

            <Link
              to="/online-doctor"
              className={navLinkClass("/online-doctor")}
            >
              Online Doctor
            </Link>

            <Link to="/contact-page" className={navLinkClass("/contact-page")}>
              Contact
            </Link>

            <Link
              to="/medicines/aboute"
              className={navLinkClass("/medicines/aboute")}
            >
              About Us
            </Link>
          </div>

          {/* ── Right side — Admin / Pharmacist Portals ── */}
          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition shadow-2xs"
              >
                <Shield size={13} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {isPharmacist && (
              <Link
                to="/pharmacist-dashboard"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs"
              >
                <UserCheck size={13} />
                <span>Pharmacist Dashboard</span>
              </Link>
            )}

            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
              <Sparkles size={12} className="text-amber-500" />
              <span>Free Delivery on ৳1000+</span>
            </div>
          </div>

          {/* ── Mobile menu trigger ── */}
          <div className="lg:hidden flex items-center justify-between w-full py-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Browse Categories
            </span>
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu dropdown ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg px-4 py-3 space-y-1 divide-y divide-slate-100">
          <div className="space-y-1 pb-2">
            <Link
              to="/"
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition"
            >
              Home
            </Link>

            {/* Medicines accordion */}
            <div>
              <button
                onClick={() =>
                  setMobileSection((p) => (p === "med" ? null : "med"))
                }
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
              >
                <span>Medicines</span>
                <ChevronIcon open={mobileSection === "med"} />
              </button>
              {mobileSection === "med" && (
                <div className="ml-3 pl-2 border-l border-teal-200 space-y-1 mt-1">
                  {medicineItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition"
                    >
                      {item.label}
                      <span className="text-[11px] text-slate-400 ml-2">
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
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
              >
                <span>Equipments</span>
                <ChevronIcon open={mobileSection === "eq"} />
              </button>
              {mobileSection === "eq" && (
                <div className="ml-3 pl-2 border-l border-teal-200 space-y-1 mt-1">
                  {equipmentItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition"
                    >
                      {item.label}
                      <span className="text-[11px] text-slate-400 ml-2">
                        {item.sub}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/products/all-products"
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition"
            >
              All Medicines
            </Link>
            <Link
              to="/online-doctor"
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition"
            >
              Online Doctor
            </Link>
            <Link
              to="/contact-page"
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition"
            >
              Contact
            </Link>
            <Link
              to="/medicines/aboute"
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition"
            >
              About Us
            </Link>
          </div>

          {(isAdmin || isPharmacist) && (
            <div className="pt-2 space-y-1">
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className="block px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 rounded-lg transition"
                >
                  Admin Dashboard
                </Link>
              )}
              {isPharmacist && (
                <Link
                  to="/pharmacist-dashboard"
                  className="block px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg transition"
                >
                  Pharmacist Dashboard
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default SecondNavbar;
