import delevary from "../../../assets/delevary.png";
import seftyImage from "../../../assets/warning.png";
import pregnancyImage from "../../../assets/pregnancy1.png";
import { Clock, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

const SafetyAdvice = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Delivery strip */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50 border border-teal-200/60 text-teal-900 text-xs font-semibold">
        <img className="w-5 h-5 object-contain" src={delevary} alt="Delivery" />
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-teal-700" />
          <span>Estimated Doorstep Delivery: <strong>12 – 24 Hours</strong></span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-500" />
          <span>Safety & Clinical Advisories</span>
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Consult your physician before taking any prescription medication.
        </p>
      </div>

      {/* Advisory 1: Alcohol Warning */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
        <img
          className="w-10 h-10 object-contain shrink-0 mt-0.5"
          src={seftyImage}
          alt="Alcohol Safety Warning"
        />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-amber-900 block mb-0.5">Alcohol Consumption Warning</span>
          It is strictly unsafe to consume alcohol with this medicine. It may increase gastrointestinal side effects or alter drug absorption.
        </div>
      </div>

      {/* Advisory 2: Pregnancy Warning */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-200/60">
        <img
          className="w-10 h-10 object-contain shrink-0 mt-0.5"
          src={pregnancyImage}
          alt="Pregnancy Advisory"
        />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-rose-900 block mb-0.5">Pregnancy & Lactation Advisory</span>
          Consult your gynecologist before usage. May carry risks to fetal development unless explicitly prescribed in life-threatening conditions.
        </div>
      </div>

      {/* Overview Accordion */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-800 mb-1">
          <FileText size={14} className="text-teal-600" />
          <span>Pharmacist Overview & Directions</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Store below 30°C in a dry place away from direct sunlight. Keep out of reach of children. Follow prescribed dosages strictly as instructed by your registered medical practitioner.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-1">
        <CheckCircle2 size={13} className="text-emerald-600" />
        <span>Verified by PharmaDoor Licensed Pharmacy Team</span>
      </div>
    </div>
  );
};

export default SafetyAdvice;
