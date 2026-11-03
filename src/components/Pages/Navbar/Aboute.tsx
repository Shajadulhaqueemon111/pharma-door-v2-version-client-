import { Link } from "react-router-dom";
import FAQSection from "./Faque";
import { ShieldCheck, Target, Eye, HeartHandshake, ArrowRight } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>About Our Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About PharmaDoor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            PharmaDoor is your trusted digital healthcare partner, delivering authentic medicines, surgical essentials, and telehealth consultations straight to your doorstep.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
              <Target size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Our Mission
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              To revolutionize healthcare delivery in Bangladesh by ensuring authentic medications are fast, affordable, cold-chain compliant, and accessible to every family.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-cyan-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5">
              <Eye size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Our Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Empower every household with digital access to registered pharmacist oversight, reliable symptom guidance, and doorstep healthcare solutions.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
              <HeartHandshake size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Our Promise
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              100% genuine products directly from DGDA licensed pharmaceuticals, temperature-controlled packaging, and round-the-clock pharmacist support.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          <FAQSection />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/contact-page"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition"
          >
            <span>Have Questions? Contact Us</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
