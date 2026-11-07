import React from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Boxes,
  CheckCheck,
  XCircle,
} from "lucide-react";

export interface OrderSummaryCounts {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  delivered: number;
  cancelled: number;
}

interface OrderSummaryCardsProps {
  counts?: OrderSummaryCounts;
  activeStatus: string;
  onSelectStatus: (status: string) => void;
  isLoading?: boolean;
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({
  counts = { total: 0, pending: 0, confirmed: 0, processing: 0, delivered: 0, cancelled: 0 },
  activeStatus,
  onSelectStatus,
  isLoading = false,
}) => {
  const cards = [
    {
      key: "ALL",
      label: "Total Orders",
      count: counts.total,
      icon: <ShoppingBag className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      bg: "hover:border-teal-500",
      activeRing: "ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-950/30",
    },
    {
      key: "PENDING",
      label: "Pending Verification",
      count: counts.pending,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      bg: "hover:border-amber-500",
      activeRing: "ring-2 ring-amber-500 border-amber-500 bg-amber-50/50 dark:bg-amber-950/30",
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      count: counts.confirmed,
      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
      bg: "hover:border-blue-500",
      activeRing: "ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
    },
    {
      key: "PROCESSING",
      label: "Processing",
      count: counts.processing,
      icon: <Boxes className="w-5 h-5 text-indigo-500" />,
      bg: "hover:border-indigo-500",
      activeRing: "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      count: counts.delivered,
      icon: <CheckCheck className="w-5 h-5 text-emerald-500" />,
      bg: "hover:border-emerald-500",
      activeRing: "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30",
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: counts.cancelled,
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      bg: "hover:border-rose-500",
      activeRing: "ring-2 ring-rose-500 border-rose-500 bg-rose-50/50 dark:bg-rose-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const isSelected = activeStatus === card.key;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectStatus(card.key)}
            className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-2xs ${
              isSelected
                ? card.activeRing
                : `bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 ${card.bg}`
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                {card.icon}
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isLoading ? (
                  <span className="inline-block w-8 h-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                ) : (
                  card.count
                )}
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {card.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default OrderSummaryCards;

