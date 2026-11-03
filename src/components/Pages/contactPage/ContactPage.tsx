import { PhoneCall, MapPin, Clock, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ContactPage = () => {
  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
          <PhoneCall size={14} className="text-teal-600" />
          <span>24/7 Dedicated Care Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          We&apos;re Here to Help You
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Have an inquiry regarding prescription validation, dosage advisory, or emergency medicine dispatch? Reach our team anytime.
        </p>
      </div>

      {/* Grid of contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phone */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 text-center flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <PhoneCall size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Call Support Helpline
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Direct line to licensed telepharmacists
            </p>
            <p className="text-base font-extrabold text-teal-700">
              09610-001122
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              +880 1234 567 890
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href="tel:09610001122"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
            >
              <span>Call Helpline Now</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* WhatsApp & Email */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 text-center flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <MessageSquare size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              WhatsApp & Email Care
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Instant messaging & prescription review
            </p>
            <p className="text-sm font-bold text-slate-800">
              support@pharmadoor.com
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              WhatsApp: +880 1234 567 890
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
            >
              <span>Open WhatsApp Chat</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-center flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <MapPin size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Central Pharmacy Hub
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              DGDA Licensed Dispensing Center
            </p>
            <p className="text-xs font-medium text-slate-700 leading-relaxed">
              PharmaDoor Central Depot & Model Pharmacy, Khagan, Ashulia, Savar, Dhaka, Bangladesh
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Clock size={13} className="text-indigo-600" />
              <span>Open 24 Hours / 7 Days</span>
            </span>
          </div>
        </div>
      </div>

      {/* Prescription banner */}
      <div className="mt-12 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Have a Doctor&apos;s Prescription?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Skip typing medicine names. Upload the photo directly for licensed pharmacist verification.
            </p>
          </div>
        </div>

        <Link
          to="/upload-prescription"
          className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shrink-0 transition"
        >
          Upload Prescription
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
