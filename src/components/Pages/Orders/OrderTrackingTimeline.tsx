import React from "react";
import {
  Check,
  Clock,
  Truck,
  Calendar,
  AlertCircle,
  XCircle,
  FileText,
  MapPin,
} from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";

export interface IStatusHistoryItem {
  status: string;
  note?: string;
  updatedByName?: string;
  updatedByRole?: string;
  updatedAt?: string | Date;
}

export interface IOrderTrackingData {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  status?: string;
  currentStepIndex: number;
  totalSteps: number;
  estimatedDeliveryDate?: string | Date;
  deliveryInfo?: {
    riderName?: string;
    riderPhone?: string;
    trackingUrl?: string;
    notes?: string;
  };
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  statusHistory?: IStatusHistoryItem[];
  timeline?: Array<{
    step: number;
    status: string;
    title: string;
    description: string;
    state: "completed" | "current" | "upcoming";
    updatedAt?: string | Date;
    note?: string;
    updatedByName?: string;
  }>;
  createdAt?: string | Date;
}

interface OrderTrackingTimelineProps {
  order: IOrderTrackingData;
  className?: string;
}

const DEFAULT_TIMELINE_STEPS = [
  {
    status: "PENDING",
    title: "Order Placed",
    description: "Prescription and order received for verification.",
  },
  {
    status: "CONFIRMED",
    title: "Pharmacist Verified",
    description: "Licensed pharmacist approved safety and dosage.",
  },
  {
    status: "PROCESSING",
    title: "Dispensing & Packing",
    description: "Medicines picked and packed in sterile environment.",
  },
  {
    status: "READY_FOR_DISPATCH",
    title: "Ready for Dispatch",
    description: "Handed over to cold-chain delivery team.",
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Rider on the way to your delivery address.",
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Safely received and verified by customer.",
  },
];

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  order,
  className = "",
}) => {
  const currentStatus = (order.orderStatus || order.status || "PENDING").toUpperCase();
  const isSpecial = ["CANCELLED", "REJECTED", "RETURNED"].includes(currentStatus);

  // Compute status step index
  const stepStatusMap: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    PAID: 2,
    READY_FOR_DISPATCH: 3,
    OUT_FOR_DELIVERY: 4,
    SHIPPED: 4,
    DELIVERED: 5,
    COMPLETED: 5,
  };

  const activeIndex = stepStatusMap[currentStatus] ?? 0;

  // Find history record for a status
  const getHistoryForStatus = (statusKey: string): IStatusHistoryItem | undefined => {
    if (!order.statusHistory || !order.statusHistory.length) return undefined;
    return [...order.statusHistory]
      .reverse()
      .find((h) => (h.status || "").toUpperCase() === statusKey);
  };

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return null;
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xs ${className}`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Order #{order.orderNumber || order._id?.slice(-8)}
            </h3>
            <OrderStatusBadge status={currentStatus} size="sm" />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Placed on {formatDate(order.createdAt) || "Recently"}
          </p>
        </div>

        {/* Estimated delivery banner */}
        {order.estimatedDeliveryDate && (
          <div className="flex items-center gap-3 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 px-4 py-2.5 rounded-2xl">
            <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Estimated Delivery
              </p>
              <p className="text-xs font-black text-teal-950 dark:text-teal-100">
                {formatDate(order.estimatedDeliveryDate)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Special Status Alert if Cancelled / Rejected */}
      {isSpecial && (
        <div
          className={`mt-6 p-4 rounded-2xl border flex items-start gap-3.5 ${
            currentStatus === "CANCELLED"
              ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200"
              : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200"
          }`}
        >
          {currentStatus === "CANCELLED" ? (
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-sm font-bold">
              Order was {currentStatus.toLowerCase()}
            </h4>
            <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
              {getHistoryForStatus(currentStatus)?.note ||
                "This order is no longer in transit. Any refundable payment will be processed automatically."}
            </p>
          </div>
        </div>
      )}

      {/* Visual Timeline (Matches the exact style from user image: Finished checkmark/blue -> In Progress blue circle with number -> Waiting gray circle) */}
      {!isSpecial && (
        <div className="py-8">
          {/* Desktop Horizontal Stepper */}
          <div className="hidden md:block">
            <div className="relative flex items-center justify-between">
              {/* Connecting Bar Background */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />

              {/* Connecting Bar Active Fill */}
              <div
                className="absolute top-5 left-8 h-1 bg-blue-600 transition-all duration-500 -z-0"
                style={{
                  width: `${(activeIndex / (DEFAULT_TIMELINE_STEPS.length - 1)) * 100}%`,
                }}
              />

              {DEFAULT_TIMELINE_STEPS.map((step, idx) => {
                const isFinished = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const history = getHistoryForStatus(step.status);

                return (
                  <div
                    key={step.status}
                    className="flex flex-col items-center text-center relative z-10 w-36"
                  >
                    {/* Circle Node (User reference design) */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isFinished
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : isCurrent
                          ? "bg-blue-600 text-white ring-4 ring-blue-500/30 shadow-lg shadow-blue-600/30 scale-110"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {isFinished ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="mt-3.5 space-y-1">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isFinished || isCurrent
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight px-1 line-clamp-2">
                        {step.description}
                      </p>

                      {/* Timestamp & Pharmacist */}
                      {history?.updatedAt && (
                        <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 mt-1">
                          {formatDate(history.updatedAt)}
                        </p>
                      )}
                      {history?.updatedByName && (
                        <p className="text-[10px] text-slate-400">
                          By: {history.updatedByName}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Stepper */}
          <div className="md:hidden space-y-6 relative pl-8 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {DEFAULT_TIMELINE_STEPS.map((step, idx) => {
              const isFinished = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const history = getHistoryForStatus(step.status);

              return (
                <div key={step.status} className="relative">
                  {/* Step node icon */}
                  <div
                    className={`absolute -left-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isFinished
                        ? "bg-blue-600 text-white"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isFinished ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          isFinished || isCurrent
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {step.description}
                    </p>
                    {history?.updatedAt && (
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                        {formatDate(history.updatedAt)}
                        {history.updatedByName && ` • By ${history.updatedByName}`}
                      </p>
                    )}
                    {history?.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 italic bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                        "{history.note}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Rider & Address Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        {/* Shipping details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900 dark:text-white">Delivery Destination</p>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              {order.shippingAddress?.fullName || "Valued Customer"} • {order.shippingAddress?.phone || "N/A"}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              {order.shippingAddress?.address || "Address on file"}, {order.shippingAddress?.city || "Dhaka"}
            </p>
          </div>
        </div>

        {/* Dispatch & Rider Information */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900 dark:text-white">Courier & Dispatch Info</p>
            {order.deliveryInfo?.riderName ? (
              <div className="text-slate-600 dark:text-slate-300 mt-0.5 space-y-0.5">
                <p>
                  <span className="font-semibold">Rider:</span> {order.deliveryInfo.riderName} (
                  {order.deliveryInfo.riderPhone || "No phone"})
                </p>
                {order.deliveryInfo.notes && (
                  <p className="text-slate-500">Note: {order.deliveryInfo.notes}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 mt-0.5">
                Rider assignment in progress once packing completes.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Complete Audit Log of Status Updates */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            Verified Status Log & Pharmacist Notes
          </h4>
          <div className="space-y-2">
            {order.statusHistory.map((item, i) => (
              <div
                key={i}
                className="text-xs flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.status}
                    </span>
                    {item.updatedByName && (
                      <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                        • {item.updatedByName} ({item.updatedByRole || "staff"})
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <p className="text-slate-600 dark:text-slate-400 mt-1 italic">
                      "{item.note}"
                    </p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {formatDate(item.updatedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingTimeline;
