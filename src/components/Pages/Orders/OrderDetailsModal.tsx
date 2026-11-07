import React, { useState } from "react";
import {
  X,
  Compass,
  XCircle,
  MapPin,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderInvoice } from "./OrderInvoice";
import { useCancelMyOrderMutation } from "../../../redux/api/orderApi";
import toast from "react-hot-toast";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
  onTrackOrder: (order: any) => void;
  onOrderUpdated?: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onTrackOrder,
  onOrderUpdated,
}) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelMyOrder, { isLoading: isCancelling }] = useCancelMyOrderMutation();

  if (!order) return null;

  const currentStatus = (order.orderStatus || order.status || "PENDING").toUpperCase();
  const canCancel = ["PENDING", "CONFIRMED"].includes(currentStatus);

  const items = order?.items?.length
    ? order.items
    : (order?.products || []).map((p: any) => ({
        productName: p.product?.name || p.product?.title || "Item",
        productImage: p.product?.image || p.product?.photo || "",
        genericName: p.product?.genericName || "",
        unitPrice: Number(p.product?.price) || 0,
        quantity: p.quantity || 1,
        subtotal: (Number(p.product?.price) || 0) * (p.quantity || 1),
      }));

  const subtotal = order?.subtotal ?? order?.totalPrice ?? 0;
  const tax = order?.tax ?? Math.round(subtotal * 0.05);
  const deliveryCharge = order?.deliveryCharge ?? 0;
  const discount = order?.discount ?? 0;
  const grandTotal = order?.totalAmount ?? order?.totalPrice ?? subtotal + tax + deliveryCharge - discount;

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelOrder = async () => {
    try {
      await cancelMyOrder({
        orderId: order._id,
        reason: cancelReason || "Cancelled by customer request",
      }).unwrap();
      toast.success("Order cancelled successfully.");
      setCancelModalOpen(false);
      if (onOrderUpdated) onOrderUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to cancel order.");
    }
  };

  if (showInvoice) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-3xl my-8">
          <OrderInvoice order={order} onClose={() => setShowInvoice(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Order Details
                </h3>
                <OrderStatusBadge status={currentStatus} size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                #{order.orderNumber || order._id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick info row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Order Placed</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Payment</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {order.paymentMethod || "Online"} (
                <span
                  className={
                    order.paymentStatus === "Paid"
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {order.paymentStatus || "Pending"}
                </span>
                )
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Est. Delivery</span>
              <span className="font-bold text-teal-700 dark:text-teal-400">
                {order.estimatedDeliveryDate
                  ? formatDate(order.estimatedDeliveryDate)
                  : "Within 2 Hours"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Items Count</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {items.length} Medicines
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin size={14} className="text-teal-600" />
              Delivery Recipient Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Recipient:</span>{" "}
                {order.shippingAddress?.fullName || order.user?.name || "Customer"}
              </p>
              <p>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Phone:</span>{" "}
                {order.shippingAddress?.phone || order.user?.phone || "N/A"}
              </p>
              <p className="sm:col-span-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Address:</span>{" "}
                {order.shippingAddress?.address || order.user?.address || "Address on file"},{" "}
                {order.shippingAddress?.city || "Dhaka"}
              </p>
              {order.customerNotes && (
                <p className="sm:col-span-2 text-teal-700 dark:text-teal-400 italic">
                  Note: "{order.customerNotes}"
                </p>
              )}
            </div>
          </div>

          {/* Snapshot Product Items */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Ordered Medicines (Snapshot Verified)
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
              {items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 flex items-center justify-between gap-4 text-xs bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage || "/placeholder-pill.png"}
                      alt={item.productName}
                      className="w-12 h-12 object-contain rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.productName}
                      </p>
                      {item.genericName && (
                        <p className="text-[11px] text-slate-500">
                          Generic: {item.genericName}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Qty: {item.quantity} × ৳{Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ৳{Number(item.subtotal || item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Cart Subtotal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ৳{Number(subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Govt. VAT (5%)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                +৳{Number(tax).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Delivery Charge</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {Number(deliveryCharge) === 0 ? "FREE" : `+৳${Number(deliveryCharge).toFixed(2)}`}
              </span>
            </div>
            {Number(discount) > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Discount</span>
                <span>-৳{Number(discount).toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline font-black">
              <span className="text-slate-900 dark:text-white">Grand Total</span>
              <span className="text-xl text-teal-700 dark:text-teal-400">
                ৳{Number(grandTotal).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle size={15} />
                Cancel Order
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoice(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Receipt size={14} className="text-teal-600" />
              View / Print Invoice
            </button>
            <button
              onClick={() => onTrackOrder(order)}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <Compass size={14} />
              Track Live Order
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Cancel Order Confirmation
                </h4>
                <p className="text-xs text-slate-500">
                  Are you sure you want to cancel this order?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Reserved medicine inventory will be safely returned to dispensary stock. If already paid online, refund processing will commence.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed doctor prescription, wrong address..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelOrder}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow transition disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsModal;
