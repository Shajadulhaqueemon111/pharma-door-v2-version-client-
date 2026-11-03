import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubmitted(true);
      toast.success("Thank you for subscribing to PharmaDoor health updates!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-teal-800/40"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold mb-4">
              <Mail size={13} />
              <span>PharmaDoor Health Newsletter</span>
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Get Medicine Discounts & Verified Health Tips
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-lg mx-auto leading-relaxed">
              Subscribe to receive weekly prescription refill alerts, exclusive cashback vouchers, and doctor-approved wellness guides.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 text-white placeholder:text-slate-400 rounded-full border border-white/20 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 text-xs sm:text-sm backdrop-blur-md transition"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe</span>
                <Send size={14} />
              </button>
            </form>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/40"
              >
                <CheckCircle2 size={14} />
                <span>You are successfully subscribed to our newsletter!</span>
              </motion.div>
            )}

            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-teal-400" />
                No Spam, unsubscribe anytime
              </span>
              <span>•</span>
              <span>Strict Privacy Protected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscribeSection;
