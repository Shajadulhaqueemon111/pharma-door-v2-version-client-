import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";
import Image1 from "../../../assets/heart.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">100% Genuine</p>
              <p className="text-[11px] text-slate-400">DGDA Licensed & Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">2-Hour Express</p>
              <p className="text-[11px] text-slate-400">Dhaka & Savar Coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Licensed Pharmacists</p>
              <p className="text-[11px] text-slate-400">Strict Safety Verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">24/7 Teleconsult</p>
              <p className="text-[11px] text-slate-400">Dial 09610-001122</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Col 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-sm p-1.5">
                <img
                  src={Image1}
                  alt="PharmaDoor Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Pharma<span className="text-teal-400">Door</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              PharmaDoor is Bangladesh&apos;s premier digital pharmacy and healthcare platform, delivering certified medications, clinical equipment, and teleconsultation services nationwide.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-teal-400" />
                <span>Helpline: 09610-001122 / +880 1234 567 890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-teal-400" />
                <span>support@pharmadoor.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-teal-400" />
                <span>PharmaDoor HQ, Savar, Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2.5 pt-2">
              {[
                { icon: <Facebook size={16} />, href: "https://facebook.com", label: "Facebook" },
                { icon: <Instagram size={16} />, href: "https://instagram.com", label: "Instagram" },
                { icon: <Youtube size={16} />, href: "https://youtube.com", label: "YouTube" },
                { icon: <Linkedin size={16} />, href: "https://linkedin.com", label: "LinkedIn" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white transition flex items-center justify-center"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about-us" className="hover:text-teal-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-teal-400 transition">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-teal-400 transition">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-teal-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-teal-400 transition">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Services & Help
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/products/all-products" className="hover:text-teal-400 transition">
                  Buy Medicines Online
                </Link>
              </li>
              <li>
                <Link to="/upload-prescription" className="hover:text-teal-400 transition">
                  Upload Prescription
                </Link>
              </li>
              <li>
                <Link to="/online-doctor" className="hover:text-teal-400 transition">
                  Online Doctor Teleconsult
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-teal-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-teal-400 transition">
                  Health Blogs
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-teal-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Compliance & App */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Regulatory Licenses
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-teal-400 block font-semibold">Online Drug License</span>
                <span className="text-slate-200 font-mono font-medium">DC-22813</span>
              </li>
              <li className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-teal-400 block font-semibold">DBID License</span>
                <span className="text-slate-200 font-mono font-medium">384191730</span>
              </li>
              <li className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-teal-400 block font-semibold">Trade License</span>
                <span className="text-slate-200 font-mono text-[11px]">TRAD/DNCC/048628/2022</span>
              </li>
            </ul>

            <div className="mt-4">
              <Link
                to="/upload-prescription"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition"
              >
                <span>Upload Rx Quickly</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} PharmaDoor Healthcare Ltd. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span>DGDA Licensed Model Pharmacy</span>
            <span>•</span>
            <span>Secured SSL Payments</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
