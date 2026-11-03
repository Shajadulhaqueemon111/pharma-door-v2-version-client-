import { motion } from "framer-motion";
import { Search, FileText, Truck, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Search & Select Medicines",
    description: "Easily find your required medicines, generic brands, or healthcare equipment through our instant search bar.",
    icon: <Search size={24} className="text-teal-600" />,
    badge: "Step 01",
    action: { text: "Find Medicine", link: "/products/all-products" },
  },
  {
    id: 2,
    title: "Upload Doctor's Prescription",
    description: "Upload a photo or PDF of your doctor's prescription. Our licensed pharmacists verify dosage and prepare your order.",
    icon: <FileText size={24} className="text-emerald-600" />,
    badge: "Step 02",
    action: { text: "Upload Rx", link: "/upload-prescription" },
  },
  {
    id: 3,
    title: "Fast Doorstep Delivery",
    description: "Receive your authentic medicines packed in temperature-monitored hygienic pouches within 2 to 24 hours.",
    icon: <Truck size={24} className="text-indigo-600" />,
    badge: "Step 03",
    action: { text: "Learn Delivery", link: "/contact-page" },
  },
];

const HowItWorks = () => {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>Simple & Reliable Healthcare</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How PharmaDoor Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Get authentic medicines and medical supplies delivered to your doorstep in 3 effortless steps.
          </p>
        </div>

        {/* 3 Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-teal-200/60 -translate-y-8 z-0 pointer-events-none" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative z-10 bg-slate-50/80 hover:bg-white rounded-3xl p-8 border border-slate-200/70 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center">
                    {step.icon}
                  </div>

                  {/* Step Badge */}
                  <span className="text-xs font-extrabold px-3 py-1 bg-slate-200/70 text-slate-700 rounded-full">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/50">
                <Link
                  to={step.action.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
                >
                  <span>{step.action.text}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
