import React from "react";
import { useAuth } from "../privateRoute/AuthContext";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, FileText, ShoppingBag, ArrowRight, Phone } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-24 text-slate-500 font-medium">
        <p className="text-base text-slate-700 font-bold mb-3">You are not signed in.</p>
        <Link
          to="/login"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        {/* Background Banner */}
        <div className="h-44 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 backdrop-blur-md border border-teal-400/30 text-teal-300 text-xs font-bold rounded-full">
            <ShieldCheck size={14} />
            <span>PharmaDoor Verified Patient</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-10 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-teal-50 flex items-center justify-center shrink-0 text-teal-700 font-extrabold text-3xl">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>

            <div className="text-center sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/60 uppercase tracking-wider">
                Role: {user.role || "User"}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {user.name || "Valued Customer"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Mail size={14} className="text-teal-600" />
              <span>{user.email}</span>
            </p>
          </div>

          {/* Quick Account Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
            <Link
              to="/upload-prescription"
              className="p-4 rounded-2xl bg-teal-50/60 hover:bg-teal-50 border border-teal-200/60 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <ArrowRight size={14} className="text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Prescription Upload</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Submit new prescription doctor note</p>
              </div>
            </Link>

            <Link
              to="/products/all-products"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Browse Medicines</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Explore catalogue of authentic drugs</p>
              </div>
            </Link>

            <Link
              to="/contact-page"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Help & Support</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Contact customer care & pharmacists</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
