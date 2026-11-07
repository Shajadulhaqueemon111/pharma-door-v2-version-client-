import React from "react";
import {
  Printer,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

interface OrderInvoiceProps {
  order: any;
  onClose?: () => void;
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const items = order?.items?.length
    ? order.items
    : (order?.products || []).map((p: any) => ({
        productName: p.product?.name || p.product?.title || "Medicine Item",
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

  return (
    <div className="bg-white text-slate-900 p-6 sm:p-10 max-w-3xl mx-auto rounded-3xl border border-slate-200 shadow-xl print:m-0 print:p-4 print:shadow-none print:border-none print:rounded-none">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 print:hidden mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tax Invoice / Receipt</h2>
          <p className="text-xs text-slate-500">Official PharmaDoor e-Pharmacy Order Document</p>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Close
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition"
          >
            <Printer size={15} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex items-start justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-teal-600 tracking-tight">PharmaDoor</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
              Licensed Dispensary
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">PharmaDoor Online Pharmacy Bangladesh</p>
          <p className="text-xs text-slate-500">Govt. Drug License: DL-DH-92418/2024</p>
          <p className="text-xs text-slate-500">Hotline: 09610-001122 • support@pharmadoor.com</p>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice No.</p>
          <p className="text-lg font-black text-slate-900">{order?.orderNumber || order?._id?.slice(-8)}</p>
          <p className="text-xs text-slate-500 mt-1">Date: {formatDate(order?.createdAt)}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700">
            <FileCheck size={13} className="text-teal-600" />
            <span>Status: {order?.orderStatus || order?.status || "PENDING"}</span>
          </div>
        </div>
      </div>

      {/* Customer & Delivery Information */}
      <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
        <div>
          <p className="font-bold uppercase tracking-wider text-slate-400 mb-2">Billed & Shipped To</p>
          <p className="font-black text-slate-800 text-sm">
            {order?.shippingAddress?.fullName || order?.user?.name || "Customer"}
          </p>
          <p className="text-slate-600 mt-0.5 flex items-center gap-1.5">
            <Phone size={12} className="text-slate-400" />
            {order?.shippingAddress?.phone || order?.user?.phone || "N/A"}
          </p>
          <p className="text-slate-600 mt-0.5 flex items-center gap-1.5">
            <Mail size={12} className="text-slate-400" />
            {order?.shippingAddress?.email || order?.user?.email || "N/A"}
          </p>
          <p className="text-slate-600 mt-1 flex items-start gap-1.5">
            <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
            <span>
              {order?.shippingAddress?.address || order?.user?.address || "Delivery Address on File"},{" "}
              {order?.shippingAddress?.city || "Dhaka"}
            </span>
          </p>
        </div>

        <div>
          <p className="font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Details</p>
          <div className="space-y-1 text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Payment Method:</span>{" "}
              {order?.paymentMethod || "Online (AamarPay)"}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Payment Status:</span>{" "}
              <span
                className={`font-bold ${
                  order?.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {order?.paymentStatus || "Pending"}
              </span>
            </p>
            {order?.transactionId && (
              <p>
                <span className="font-semibold text-slate-800">Transaction ID:</span>{" "}
                <span className="font-mono text-[11px]">{order.transactionId}</span>
              </p>
            )}
            {order?.customerNotes && (
              <p className="text-slate-500 italic mt-2">
                <span className="font-semibold text-slate-700">Patient Note:</span> "{order.customerNotes}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Snapshot Table */}
      <div className="py-6 border-b border-slate-200">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5 font-bold">#</th>
              <th className="py-2.5 font-bold">Item & Generic Details</th>
              <th className="py-2.5 font-bold text-right">Unit Price</th>
              <th className="py-2.5 font-bold text-center">Qty</th>
              <th className="py-2.5 font-bold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item: any, idx: number) => (
              <tr key={idx} className="py-2">
                <td className="py-3 text-slate-400 font-mono">{idx + 1}</td>
                <td className="py-3">
                  <p className="font-bold text-slate-900">{item.productName || item.name}</p>
                  {item.genericName && (
                    <p className="text-[11px] text-slate-500">Generic: {item.genericName}</p>
                  )}
                </td>
                <td className="py-3 text-right font-medium text-slate-700">
                  ৳{Number(item.unitPrice || item.price || 0).toFixed(2)}
                </td>
                <td className="py-3 text-center font-bold text-slate-800">
                  {item.quantity || 1}
                </td>
                <td className="py-3 text-right font-bold text-slate-900">
                  ৳{Number(item.subtotal || (item.unitPrice || item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Breakdown & Sign-off */}
      <div className="grid grid-cols-2 gap-6 pt-6 text-xs">
        <div className="space-y-3">
          <div className="p-3 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-teal-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-teal-900 leading-relaxed">
              This invoice certifies genuine, batch-verified pharmaceuticals procured from registered manufacturers under DGDA guidelines.
            </p>
          </div>
          <p className="text-[10px] text-slate-400 italic">
            Computer generated invoice. No signature required.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">৳{Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Govt. VAT (5%)</span>
            <span className="font-semibold text-slate-800">+৳{Number(tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee</span>
            <span className="font-semibold text-slate-800">
              {Number(deliveryCharge) === 0 ? "FREE" : `+৳${Number(deliveryCharge).toFixed(2)}`}
            </span>
          </div>
          {Number(discount) > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>-৳{Number(discount).toFixed(2)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-slate-300 flex justify-between items-baseline">
            <span className="text-sm font-black text-slate-900 uppercase">Grand Total</span>
            <span className="text-xl font-black text-teal-700">৳{Number(grandTotal).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoice;
