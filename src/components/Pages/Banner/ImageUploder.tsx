import image1 from "../../../assets/Image (2).png";
import productImage from "../../../assets/product.png";
import callImage from "../../../assets/download.png";
import { Link } from "react-router-dom";
import { UploadCloud, ShoppingBag, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";

const ImageUploder = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 3 Action Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Upload Prescription */}
        <div className="group relative bg-gradient-to-br from-teal-500/10 via-white to-emerald-500/5 rounded-2xl p-6 border border-teal-100/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center shadow-2xs">
                <UploadCloud size={20} />
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full">
                Quick Process
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
              Upload Prescription
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Don&apos;t know the generic name? Just take a photo of your doctor&apos;s prescription. We will verify and deliver.
            </p>

            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-teal-600" />
                <span>Licensed Pharmacist Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-teal-600" />
                <span>Exact Dosage Dispensing</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-teal-50 flex items-center justify-between">
            <Link
              to="/upload-prescription"
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <span>Upload Now</span>
              <ArrowRight size={13} />
            </Link>
            <img
              src={image1}
              alt="Upload Rx"
              className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card 2: Healthcare Products */}
        <div className="group relative bg-gradient-to-br from-cyan-500/10 via-white to-blue-500/5 rounded-2xl p-6 border border-cyan-100/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center shadow-2xs">
                <ShoppingBag size={20} />
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 bg-cyan-100 text-cyan-800 rounded-full">
                100% Authentic
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 group-hover:text-cyan-700 transition-colors">
              Healthcare & OTC
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Explore thousands of everyday health essentials, surgical diagnostics, multivitamins, and pediatric care.
            </p>

            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-cyan-600" />
                <span>Stored in Cold-Chain Facility</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-cyan-600" />
                <span>Top Pharmaceutical Brands</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-cyan-50 flex items-center justify-between">
            <Link
              to="/products/all-products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <span>Order Medicines</span>
              <ArrowRight size={13} />
            </Link>
            <img
              src={productImage}
              alt="Healthcare Products"
              className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card 3: 24/7 Helpline */}
        <div className="group relative bg-gradient-to-br from-indigo-500/10 via-white to-violet-500/5 rounded-2xl p-6 border border-indigo-100/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shadow-2xs">
                <PhoneCall size={20} />
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                24/7 Support
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
              Dedicated Helpline
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Have questions about dosage or urgent requirements? Reach our teleconsultants anytime around the clock.
            </p>

            <ul className="mt-3 space-y-1 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600" />
                <span>Call Center: 09610-001122</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600" />
                <span>Live WhatsApp Assistance</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-indigo-50 flex items-center justify-between">
            <Link
              to="/contact-page"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
            >
              <span>Contact Care</span>
              <ArrowRight size={13} />
            </Link>
            <img
              src={callImage}
              alt="Call Helpline"
              className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploder;
