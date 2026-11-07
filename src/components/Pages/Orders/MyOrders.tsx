/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowUpDown,
  Eye,
  Compass,
  ShoppingBag,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
  PackageX,
} from "lucide-react";
import { useGetMyOrdersQuery } from "../../../redux/api/orderApi";
import { OrderSummaryCards } from "./OrderSummaryCards";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { OrderTrackingTimeline } from "./OrderTrackingTimeline";
import { SOCKET_SERVER_URL } from "../../../config/api";
import { useAuth } from "../privateRoute/AuthContext";
import io from "socket.io-client";

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<any | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyOrdersQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    sortBy: "createdAt",
    sortOrder,
    page,
    limit: 6,
  });

  const orders = ordersResponse?.data?.orders || [];
  const meta = ordersResponse?.data?.meta || { total: 0, page: 1, limit: 6, totalPages: 1 };
  const counts = ordersResponse?.data?.summaryCounts || {
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0,
  };

  // Socket listener for real-time order updates
  useEffect(() => {
    if (!user?._id) return;
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("join-user-room", { userId: user._id });
    });

    socket.on("order-status-updated", () => {
      refetch();
    });

    socket.on("new-order-received", () => {
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, refetch]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>My Prescriptions & Medicine Orders</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track live dispatch status, download tax invoices, and view dispensory history.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin text-teal-600" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <OrderSummaryCards
        counts={counts}
        activeStatus={statusFilter}
        onSelectStatus={handleStatusFilterChange}
        isLoading={isLoading}
      />

      {/* Live Tracking Timeline View (if user selected an order to track) */}
      {trackingOrder && (
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600 animate-spin-slow" />
              <span>Live Order Tracking Timeline</span>
            </h3>
            <button
              onClick={() => setTrackingOrder(null)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Hide Live Tracking
            </button>
          </div>
          <OrderTrackingTimeline order={trackingOrder} />
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search box (7 cols) */}
          <div className="sm:col-span-7 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by Order ID (e.g. PD-2026-...) or Medicine name..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-800 transition"
            />
          </div>

          {/* Status filter dropdown (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Verification</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Dispensing / Processing</option>
              <option value="READY_FOR_DISPATCH">Ready for Dispatch</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Sort order (2 cols) */}
          <div className="sm:col-span-2">
            <button
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse h-28"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <PackageX size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No orders found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "ALL"
              ? "No orders match your filter criteria. Try clearing search or status."
              : "You haven't placed any medicine orders yet. Explore our genuine pharmacy catalogue."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const currentStatus = order.orderStatus || order.status || "PENDING";
            const items = order.items?.length
              ? order.items
              : (order.products || []).map((p: any) => ({
                  productName: p.product?.name || p.product?.title || "Medicine",
                  productImage: p.product?.image || p.product?.photo || "",
                  quantity: p.quantity || 1,
                  unitPrice: p.product?.price || 0,
                  subtotal: (p.product?.price || 0) * (p.quantity || 1),
                }));

            const firstItem = items[0] || {};
            const moreItemsCount = Math.max(0, items.length - 1);
            const totalAmount = order.totalAmount ?? order.totalPrice ?? 0;

            return (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                {/* Top order summary header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      #{order.orderNumber || order._id?.slice(-8)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock size={13} />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={currentStatus} size="sm" />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {order.paymentMethod || "Online"} (
                      <span
                        className={
                          order.paymentStatus === "Paid"
                            ? "text-emerald-600 font-bold"
                            : "text-amber-600 font-bold"
                        }
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                      )
                    </span>
                  </div>
                </div>

                {/* Main Item details row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Product Thumbnail & Details */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={firstItem.productImage || "/placeholder-pill.png"}
                        alt={firstItem.productName || "Product"}
                        className="w-14 h-14 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1.5"
                      />
                      {moreItemsCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                          +{moreItemsCount}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                        {firstItem.productName || "Healthcare Product"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Qty: {firstItem.quantity || 1}
                        {moreItemsCount > 0 && ` + ${moreItemsCount} other medicines`}
                      </p>
                      <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-1">
                        Total Amount: ৳{Number(totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => setSelectedOrderForDetails(order)}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Eye size={14} className="text-teal-600" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setTrackingOrder(order);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Compass size={14} />
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Page {meta.page} of {meta.totalPages} ({meta.total} orders)
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details & Invoice Modal */}
      {selectedOrderForDetails && (
        <OrderDetailsModal
          order={selectedOrderForDetails}
          onClose={() => setSelectedOrderForDetails(null)}
          onTrackOrder={(ord) => {
            setSelectedOrderForDetails(null);
            setTrackingOrder(ord);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOrderUpdated={() => refetch()}
        />
      )}
    </div>
  );
};

export default MyOrders;
