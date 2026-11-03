import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import SearchBar from "./SearchBar";
import UserMenu from "./UsreMenu";
import SecondNavbar from "./SecondNavbar";
import { FileText, Phone, ShieldCheck, Zap } from "lucide-react";
import Image1 from "../../../assets/heart.png";

type FirstNavbarProps = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
};

const FirstNavbar: React.FC<FirstNavbarProps> = ({
  searchText,
  setSearchText,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlelogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-xs bg-white">
      {/* ── Top Announcement Utility Bar ── */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-slate-200 text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-teal-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              100% Genuine Medicines
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Zap size={13} className="text-amber-400" />
              2-Hour Express Delivery in Savar & Dhaka
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 ml-auto">
            <Link
              to="/upload-prescription"
              className="flex items-center gap-1 hover:text-emerald-300 transition text-slate-300 font-medium"
            >
              <FileText size={13} className="text-teal-400" />
              <span>Upload Prescription</span>
            </Link>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a
              href="tel:09610001122"
              className="hidden sm:flex items-center gap-1 hover:text-emerald-300 transition text-slate-300 font-medium"
            >
              <Phone size={13} className="text-emerald-400" />
              <span>Hotline: 09610-001122</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Brand & Search Navigation ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 p-1.5">
              <img
                src={Image1}
                alt="PharmaDoor Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none text-slate-900">
                Pharma<span className="text-teal-600">Door</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-teal-700/80 mt-0.5">
                Online Pharmacy BD
              </span>
            </div>
          </Link>

          {/* SearchBar */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-4">
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              to="/upload-prescription"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 rounded-full text-xs font-semibold transition-all shadow-2xs"
            >
              <FileText size={14} className="text-teal-600" />
              <span>Upload Rx</span>
            </Link>

            {user ? (
              user.role === "user" ? (
                <UserMenu user={user} handleLogout={handlelogout} />
              ) : (
                <button
                  onClick={handlelogout}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-full text-xs font-semibold transition cursor-pointer"
                >
                  Logout
                </button>
              )
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow transition flex items-center gap-1.5 cursor-pointer">
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Sub-Navbar ── */}
      <SecondNavbar />
    </header>
  );
};

export default FirstNavbar;
