/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Check,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { API_BASE_URL } from "../../../config/api";
import { useCart } from "../AddToCart/CartContext";

type Medicine = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  category?: string;
  medicineType?: string;
  description?: string;
  medicineImage: string;
  matchConfidence?: number;
  matchReason?: string;
  suggestedDosage?: string;
  inStock?: boolean;
};

const PrescriptionUpload = () => {
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [detectedKeywords, setDetectedKeywords] = useState<string[]>([]);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const { updateCartCount } = useCart();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPrescriptionFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setMedicines([]);
      setExtractedText("");
      setDetectedKeywords([]);
    }
  };

  const handleSearchMedicines = async () => {
    if (!prescriptionFile) {
      toast.error("Please upload your prescription first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("prescription", prescriptionFile);

      const token = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `${token}`;
      }

      // Try local/configured API endpoint first, fallback to deployed if needed
      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/api/v1/medicine/prescription`, {
          method: "POST",
          headers,
          body: formData,
        });
      } catch {
        // Fallback to deployed backend if local is unreachable
        response = await fetch(
          "https://pharmadoor-backend-v2.vercel.app/api/v1/medicine/prescription",
          {
            method: "POST",
            headers,
            body: formData,
          },
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || errorData?.message || "Failed to process prescription.");
      }

      const data = await response.json();
      const matched = data.data || [];
      setMedicines(matched);
      setExtractedText(data.meta?.extractedText || "");
      setDetectedKeywords(data.meta?.detectedKeywords || []);

      if (matched.length === 0) {
        toast("No exact medicines detected. Our licensed pharmacist will review it for you.", {
          icon: "ℹ️",
        });
      } else {
        toast.success(`Found ${matched.length} matched medicines in stock!`, {
          icon: "💊",
        });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while processing your prescription");
      toast.error(err.message || "Failed to scan prescription");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (med: Medicine) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemToAdd = {
      _id: med._id,
      name: med.name,
      brand: med.brand,
      price: med.price,
      stock: med.stock,
      medicineImage: med.medicineImage,
      quantity: 1,
      dosage: med.suggestedDosage,
    };

    const isAlready = existingCart.some((item: any) => item._id === med._id);
    if (!isAlready) {
      existingCart.push(itemToAdd);
      localStorage.setItem("cart", JSON.stringify(existingCart));
    }

    setAddedItemIds((prev) => ({ ...prev, [med._id]: true }));
    window.dispatchEvent(new Event("cartUpdated"));
    updateCartCount();
    toast.success(`${med.name} added to cart!`);
  };

  const handleAddAllToCart = () => {
    if (medicines.length === 0) return;
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItems: any[] = [...existingCart];

    medicines.forEach((med) => {
      if (!newItems.some((item: any) => item._id === med._id)) {
        newItems.push({
          _id: med._id,
          name: med.name,
          brand: med.brand,
          price: med.price,
          stock: med.stock,
          medicineImage: med.medicineImage,
          quantity: 1,
          dosage: med.suggestedDosage,
        });
      }
    });

    localStorage.setItem("cart", JSON.stringify(newItems));
    const allAdded: Record<string, boolean> = {};
    medicines.forEach((m) => (allAdded[m._id] = true));
    setAddedItemIds(allAdded);

    window.dispatchEvent(new Event("cartUpdated"));
    updateCartCount();
    toast.success(`Added all ${medicines.length} medicines to cart!`, { icon: "🛒" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
          <Sparkles size={14} className="text-teal-600 animate-pulse" />
          <span>Real-Time Prescription Recognition & Dispensation</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Upload Your Prescription
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Upload an image of your doctor&apos;s prescription. Our optical intelligence matches medicines from verified PharmaDoor stock in real time.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl max-w-2xl mx-auto">
        {/* Upload Zone */}
        <label
          htmlFor="prescriptionInput"
          className="group relative block mb-6 cursor-pointer border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/60 rounded-3xl p-8 text-center transition-all duration-200 overflow-hidden"
        >
          {preview ? (
            <div className="space-y-3 relative">
              <img
                src={preview}
                alt="Prescription Preview"
                className="mx-auto max-h-64 object-contain rounded-2xl shadow-md border border-slate-200"
              />

              {/* Scanning Laser Animation during processing */}
              {loading && (
                <div className="absolute inset-0 bg-teal-900/15 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 shadow-lg shadow-teal-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                  <div className="bg-slate-900/85 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-teal-400" />
                    <span>Scanning prescription text & medicines...</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-teal-700 font-bold">
                Click or drag another image to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UploadCloud size={30} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Click to browse prescription file
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supports JPG, PNG or PDF (Max 10MB)
                </p>
              </div>
            </div>
          )}
        </label>

        <input
          id="prescriptionInput"
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Guidelines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Ensure medicine names & doctor info are visible</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Avoid blurry lighting or heavy glare</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSearchMedicines}
          disabled={loading || !prescriptionFile}
          className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-700/25 hover:shadow-teal-700/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="animate-spin" />
              <span>Scanning & Matching In Stock Medicines...</span>
            </div>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Detect & Suggest Medicines in Real-Time</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-teal-600" />
          <span>Prescriptions are HIPAA / DGDA compliant and kept strictly confidential.</span>
        </div>
      </div>

      {/* Online Doctor Consultation Callout Banner */}
      <div className="mt-8 max-w-2xl mx-auto bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-teal-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <Stethoscope size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold">Need a doctor to review your prescription?</h4>
            <p className="text-xs text-teal-200/80 mt-0.5">
              Connect with a verified BMDC doctor for instant video consultation and digital advice.
            </p>
          </div>
        </div>

        <Link
          to="/online-doctor"
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-extrabold rounded-xl shrink-0 transition shadow-md flex items-center gap-1.5"
        >
          <span>Consult Doctor Online</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Matched Medicines Section */}
      {medicines.length > 0 && (
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>Prescription Matched Medicines</span>
                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                  {medicines.length} Available
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified genuine stock ready for 2-hour doorstep delivery.
              </p>
            </div>

            <button
              onClick={handleAddAllToCart}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-md transition cursor-pointer"
            >
              <ShoppingCart size={15} />
              <span>Add All to Cart</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.map((med) => {
              const isAdded = addedItemIds[med._id];
              return (
                <motion.div
                  key={med._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5">
                    {/* Badge and Match Confidence */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                        {med.medicineType || "Prescription"}
                      </span>
                      {med.matchConfidence && (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          <span>{med.matchConfidence}% Match</span>
                        </span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="h-44 bg-slate-50 rounded-2xl p-4 flex items-center justify-center mb-4">
                      <img
                        src={med.medicineImage}
                        alt={med.name}
                        className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                      />
                    </div>

                    <h4 className="text-base font-bold text-slate-900 truncate">
                      {med.name}
                    </h4>

                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Brand: <span className="text-slate-700">{med.brand}</span>
                    </p>

                    {/* Suggested Dosage info */}
                    {med.suggestedDosage && (
                      <div className="mt-3 p-2.5 bg-teal-50/70 rounded-xl border border-teal-100 text-[11px] text-teal-800">
                        <span className="font-bold">Detected Dosage: </span>
                        <span>{med.suggestedDosage}</span>
                      </div>
                    )}

                    {med.matchReason && (
                      <p className="text-[10px] text-slate-400 mt-1 italic">
                        {med.matchReason}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Price: </span>
                        <span className="text-base font-extrabold text-teal-700">
                          ৳{med.price}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {med.stock > 0 ? "In Stock" : "Limited Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <Link
                      to={`/prescription-medicine-details/${med._id}`}
                      className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </Link>

                    <button
                      onClick={() => handleAddToCart(med)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-teal-600 hover:bg-teal-700 text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={13} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Collapsible Extracted OCR Text for Transparency */}
          {extractedText && (
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-4">
              <button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-teal-600" />
                  <span>View Extracted Prescription OCR Text & Detected Keywords</span>
                  {detectedKeywords.length > 0 && (
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-semibold">
                      {detectedKeywords.join(", ")}
                    </span>
                  )}
                </div>
                {showExtractedText ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence>
                {showExtractedText && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-slate-100"
                  >
                    <p className="text-[11px] text-slate-500 font-mono whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {extractedText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrescriptionUpload;
