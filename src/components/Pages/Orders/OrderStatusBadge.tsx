import React from "react";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  CheckCheck,
  XCircle,
  AlertOctagon,
  RotateCcw,
  Boxes,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const normalizeStatus = (status: string): string => {
  const s = (status || "").toUpperCase();
  if (s === "PENDING") return "PENDING";
  if (s === "CONFIRMED") return "CONFIRMED";
  if (s === "PROCESSING" || s === "PAID") return "PROCESSING";
  if (s === "READY_FOR_DISPATCH") return "READY_FOR_DISPATCH";
  if (s === "OUT_FOR_DELIVERY" || s === "SHIPPED") return "OUT_FOR_DELIVERY";
  if (s === "DELIVERED" || s === "COMPLETED") return "DELIVERED";
  if (s === "CANCELLED") return "CANCELLED";
  if (s === "REJECTED") return "REJECTED";
  if (s === "RETURNED") return "RETURNED";
  return s;
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const norm = normalizeStatus(status);

  const configMap: Record<
    string,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    PENDING: {
      label: "Pending Verification",
      icon: <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-800 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800/60",
    },
    CONFIRMED: {
      label: "Confirmed by Pharmacist",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800/60",
    },
    PROCESSING: {
      label: "Dispensing Medicines",
      icon: <Boxes className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />,
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      text: "text-indigo-800 dark:text-indigo-300",
      border: "border-indigo-200 dark:border-indigo-800/60",
    },
    READY_FOR_DISPATCH: {
      label: "Ready for Dispatch",
      icon: <Package className="w-3.5 h-3.5 text-cyan-500" />,
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      text: "text-cyan-800 dark:text-cyan-300",
      border: "border-cyan-200 dark:border-cyan-800/60",
    },
    OUT_FOR_DELIVERY: {
      label: "Out for Delivery",
      icon: <Truck className="w-3.5 h-3.5 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-800 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800/60",
    },
    DELIVERED: {
      label: "Delivered",
      icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-800 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800/60",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-800 dark:text-rose-300",
      border: "border-rose-200 dark:border-rose-800/60",
    },
    REJECTED: {
      label: "Rejected",
      icon: <AlertOctagon className="w-3.5 h-3.5 text-red-500" />,
      bg: "bg-red-50 dark:bg-red-950/40",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800/60",
    },
    RETURNED: {
      label: "Returned",
      icon: <RotateCcw className="w-3.5 h-3.5 text-slate-500" />,
      bg: "bg-slate-100 dark:bg-slate-800",
      text: "text-slate-800 dark:text-slate-300",
      border: "border-slate-300 dark:border-slate-700",
    },
  };

  const current = configMap[norm] || {
    label: status || "Unknown",
    icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
    bg: "bg-slate-50 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  };

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-semibold",
    md: "text-xs px-2.5 py-1 gap-1.5 font-bold",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-bold",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-colors ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default OrderStatusBadge;

