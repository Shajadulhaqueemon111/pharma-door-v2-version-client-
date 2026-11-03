import { motion } from "framer-motion";
import OtcImage from "../../../assets/otcbanner.png";
import { Stethoscope, Activity, Headphones, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Stethoscope size={24} className="text-teal-600" />,
    title: "On Call Doctor Consultation",
    description:
      "Our certified and cooperative physicians are available on call to provide you with fast diagnosis and safe prescription guidance.",
    badge: "Certified Doctors",
  },
  {
    icon: <Activity size={24} className="text-cyan-600" />,
    title: "Smart Digital Diagnosis",
    description:
      "PharmaDoor provides convenient home diagnostic bookings, swift sample collection, verified reports, and free doctor consultations.",
    badge: "Lab Certified",
  },
  {
    icon: <Headphones size={24} className="text-indigo-600" />,
    title: "24/7 Dedicated Support",
    description:
      "Operated by licensed pharmacists and patient support specialists around the clock to address any medicine or dosage queries.",
    badge: "Always Online",
  },
];

const OtcBannerPage = () => {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── HERO BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative rounded-3xl p-6 sm:p-10 md:p-12 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white overflow-hidden shadow-2xl border border-teal-800/30"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-4">
              <CheckCircle2 size={13} />
              <span>Safe Healthcare At Your Doorstep</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              Essential OTC Remedies & Health Supplements
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Over-The-Counter (OTC) medicines are safe therapies available without mandatory prescriptions. Perfect for fast relief from fever, flu, aches, indigestion, and common allergies.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <Link
                to="/products/all-products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                <span>Browse Products</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact-page"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-all"
              >
                <span>Consult Support</span>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="shrink-0"
          >
            <img
              src={OtcImage}
              alt="OTC Banner"
              className="w-56 sm:w-72 md:w-80 object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── 3 FEATURE CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-2xs">
                  {feature.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  {feature.badge}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-2">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-teal-600">
              <CheckCircle2 size={13} />
              <span>Available 24/7 on PharmaDoor</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OtcBannerPage;
