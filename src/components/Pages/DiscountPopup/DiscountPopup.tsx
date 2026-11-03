import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Copy, Check, Tag } from "lucide-react";
import toast from "react-hot-toast";

const DiscountPopup = () => {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in session
    const dismissed = sessionStorage.getItem("pharma_discount_dismissed");
    if (dismissed) return;

    // Show popup after 2 seconds
    const showTimer = setTimeout(() => {
      setShow(true);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("pharma_discount_dismissed", "true");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PHARMA20");
    setCopied(true);
    toast.success("Coupon code 'PHARMA20' copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden text-center"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
              <Sparkles size={28} />
            </div>

            {/* Headline */}
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              Special Welcome Gift
            </span>

            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
              Get Flat 20% Off!
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Enjoy flat 20% savings on your first order of authentic prescription and OTC healthcare medicines.
            </p>

            {/* Voucher Box */}
            <div className="mt-5 p-3.5 bg-slate-50 border border-dashed border-teal-400/80 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-left">
                <Tag size={18} className="text-teal-600" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Use Coupon Code
                  </span>
                  <span className="text-base font-extrabold text-slate-900 tracking-wider">
                    PHARMA20
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={handleClose}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-700/20 hover:shadow-teal-700/40 transition cursor-pointer"
              >
                Claim Discount & Shop
              </button>

              <button
                onClick={handleClose}
                className="text-xs text-slate-400 hover:text-slate-600 py-1 transition cursor-pointer"
              >
                No thanks, I will browse full price
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DiscountPopup;
