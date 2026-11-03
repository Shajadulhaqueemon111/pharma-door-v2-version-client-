import OfferSection from "../OfferSection/OfferSection";
import ImageUploder from "./ImageUploder";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Headphones, Award } from "lucide-react";

const trustBadges = [
  {
    icon: <ShieldCheck className="text-teal-600" size={18} />,
    title: "100% Genuine Medicines",
    desc: "Sourced directly from manufacturers",
  },
  {
    icon: <Truck className="text-teal-600" size={18} />,
    title: "Express Doorstep Delivery",
    desc: "Temperature-controlled packaging",
  },
  {
    icon: <Award className="text-teal-600" size={18} />,
    title: "DGDA Licensed & Verified",
    desc: "Certified model pharmacy standard",
  },
  {
    icon: <Headphones className="text-teal-600" size={18} />,
    title: "Licensed Pharmacist Care",
    desc: "Free telephonic dosage guidance",
  },
];

const BannerCard = () => {
  return (
    <section className="w-full">
      {/* ── Trust Pillars Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section Title ── */}
      <div className="mt-8 px-4 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
            Smart Healthcare In Bangladesh
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
            Order Medicines Safely & Confidently With PharmaDoor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl mx-auto">
            Get authentic prescription drugs, surgical instruments, and wellness supplements delivered directly to your doorstep.
          </p>
        </motion.div>
      </div>

      {/* ── 3 Action Cards ── */}
      <ImageUploder />

      {/* ── Special Offers Section ── */}
      <div id="special-offers">
        <OfferSection />
      </div>
    </section>
  );
};

export default BannerCard;
