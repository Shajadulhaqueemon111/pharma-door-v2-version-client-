/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../privateRoute/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";

const UserMenu = ({
  handleLogout,
}: {
  user: any;
  handleLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link to="/login">
        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs hover:shadow transition flex items-center gap-1.5">
          <User size={15} />
          <span>Login</span>
        </button>
      </Link>
    );
  }

  if (user.role !== "user") {
    return (
      <button
        onClick={handleLogout}
        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-full border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
      >
        <LogOut size={14} />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-500 bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xs">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>
        <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden sm:inline">
          {user.name || "Account"}
        </span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3">
            <p className="text-xs text-slate-400 font-medium">Signed in as</p>
            <p className="text-sm font-bold text-slate-800 truncate">{user.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              <User size={15} />
              <span>My Profile</span>
              <span className="ml-auto text-[10px] bg-teal-100 text-teal-700 font-bold px-1.5 py-0.5 rounded-full">
                Active
              </span>
            </Link>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut size={15} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
