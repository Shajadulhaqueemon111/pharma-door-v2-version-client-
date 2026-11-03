import { ShieldCheck, Truck, Headphones, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Image1 from "../../../assets/heart.png";

const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
          <Award size={14} className="text-teal-600" />
          <span>About PharmaDoor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Revolutionizing Digital Pharmacy in Bangladesh
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Dedicated to providing 100% authentic medicines, clinical diagnostic gear, and professional pharmacist care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Your Trusted Healthcare Partner
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            PharmaDoor is a licensed model online pharmacy platform committed to bridging the gap between authentic pharmaceutical manufacturing and patients across Bangladesh. We maintain strict cold-chain compliance and verify every single prescription before delivery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShieldCheck className="text-teal-600 shrink-0" size={16} />
              <span>100% Genuine Medicines</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Truck className="text-teal-600 shrink-0" size={16} />
              <span>Express 2-Hr Home Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Award className="text-teal-600 shrink-0" size={16} />
              <span>DGDA Licensed System</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Headphones className="text-teal-600 shrink-0" size={16} />
              <span>24/7 Licensed Pharmacists</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/products/all-products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
            >
              <span>Explore All Medicines</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 bg-gradient-to-tr from-teal-50 to-emerald-50 rounded-2xl border border-teal-100">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-600 text-white flex items-center justify-center shadow-lg p-3">
              <img
                src={Image1}
                alt="PharmaDoor"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <h3 className="text-xl font-bold text-slate-800">PharmaDoor Healthcare</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Serving Dhaka, Savar, and delivering healthcare security nationwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
