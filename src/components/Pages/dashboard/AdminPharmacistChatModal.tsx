/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Search,
  ShieldCheck,
  Paperclip,
  Package,
  Pill,
  Truck,
  Headphones,
  Sparkles,
} from "lucide-react";
import {
  useGetAdminSupportConversationsQuery,
  useGetAdminChatWithPharmacistQuery,
  useSendSupportMessageMutation,
} from "../../../redux/api/supportChatApi";
import { SOCKET_SERVER_URL } from "../../../config/api";
import io from "socket.io-client";
import toast from "react-hot-toast";

interface AdminPharmacistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export const AdminPharmacistChatModal: React.FC<AdminPharmacistChatModalProps> = ({
  isOpen,
  onClose,
  onUnreadChange,
}) => {
  const [selectedPharmacistId, setSelectedPharmacistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null);

  const { data: convResponse, refetch: refetchConversations } =
    useGetAdminSupportConversationsQuery(undefined, {
      skip: !isOpen,
      pollingInterval: 10000,
    });

  const rawData = convResponse?.data;
  const conversations: any[] = Array.isArray(rawData?.chats)
    ? rawData.chats
    : Array.isArray(rawData)
    ? rawData
    : [];

  const totalUnreadForAdmin =
    rawData?.totalUnreadAdmin ??
    conversations.reduce(
      (acc: number, c: any) => acc + (c?.unreadForAdmin || 0),
      0
    );

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(totalUnreadForAdmin);
    }
  }, [totalUnreadForAdmin, onUnreadChange]);

  useEffect(() => {
    if (!selectedPharmacistId && conversations.length > 0) {
      const first = conversations[0];
      const fId = typeof first?.pharmacistId === "object" ? first.pharmacistId?._id : first?.pharmacistId;
      if (fId) setSelectedPharmacistId(fId);
    }
  }, [conversations, selectedPharmacistId]);

  const { data: activeChatResponse, refetch: refetchActiveChat } =
    useGetAdminChatWithPharmacistQuery(selectedPharmacistId || "", {
      skip: !selectedPharmacistId || !isOpen,
      pollingInterval: 5000,
    });

  const [sendSupportMessage, { isLoading: isSending }] = useSendSupportMessageMutation();

  const activeChat = activeChatResponse?.data;
  const messages = activeChat?.messages || [];

  // Socket setup
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-admin-room");
      if (selectedPharmacistId) {
        socket.emit("join-pharmacist-chat", { pharmacistId: selectedPharmacistId });
      }
    });

    socket.on("receive-pharmacist-chat", (data: any) => {
      if (data.pharmacistId === selectedPharmacistId) {
        refetchActiveChat();
      }
      refetchConversations();
    });

    socket.on("admin-support-chat-updated", () => {
      refetchConversations();
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedPharmacistId, refetchActiveChat, refetchConversations]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend || !selectedPharmacistId || isSending) return;

    try {
      setInputText("");
      setSelectedQuickAction(null);

      await sendSupportMessage({
        text: textToSend,
        message: textToSend,
        pharmacistId: selectedPharmacistId,
      }).unwrap();

      if (socketRef.current) {
        socketRef.current.emit("send-pharmacist-chat", {
          pharmacistId: selectedPharmacistId,
          text: textToSend,
          message: textToSend,
          senderRole: "admin",
        });
      }

      refetchActiveChat();
      refetchConversations();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  const handleQuickAction = (topic: string, promptTemplate: string) => {
    setSelectedQuickAction(topic);
    setInputText(promptTemplate);
    inputRef.current?.focus();
  };

  const filteredConversations = conversations.filter((c: any) => {
    const pName = c?.pharmacistName || c?.pharmacistId?.name || "";
    const pEmail = c?.pharmacistEmail || c?.pharmacistId?.email || "";
    const q = searchTerm.toLowerCase();
    return pName.toLowerCase().includes(q) || pEmail.toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[660px] max-h-[94vh] overflow-hidden">
        {/* PREMIUM EMERALD GRADIENT HEADER */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0 shadow-md">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Desk"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center justify-center transition cursor-pointer z-10"
          >
            <X size={18} />
          </button>

          <div className="flex items-center justify-between relative z-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-inner shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 text-white stroke-[2.2]"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5v4.5m-2.25-2.25h4.5"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight">PharmaDoor</span>
                  <span className="text-white/40 font-light">|</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Admin Helpdesk
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/90 font-medium">
                  Confidential Pharmacist Communication System
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 pr-8 text-[11px] text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
              <span>Real-Time Support Channel Active</span>
            </div>
          </div>
        </div>

        {/* SECURITY & PRIVACY PILL BANNER */}
        <div className="px-4 pt-3 pb-1">
          <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs font-medium shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={13} />
            </div>
            <p className="leading-tight">
              Messages are isolated 1-on-1: no pharmacist can read conversations of other pharmacists.
            </p>
          </div>
        </div>

        {/* CONTENT BODY: Split layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          {/* Left Column: Pharmacist list (4 cols) */}
          <div className="md:col-span-5 flex flex-col h-full bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search pharmacist..."
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active pharmacist conversations.
                </div>
              ) : (
                filteredConversations.map((c: any) => {
                  const pId = typeof c?.pharmacistId === "object" ? c.pharmacistId?._id : c?.pharmacistId;
                  const isSelected = selectedPharmacistId === pId;
                  const unread = c?.unreadForAdmin || 0;
                  const pName = c?.pharmacistName || c?.pharmacistId?.name || "Pharmacist";
                  const lastMsg = typeof c?.lastMessage === "string" ? c.lastMessage : "Started conversation";

                  return (
                    <div
                      key={pId || Math.random()}
                      onClick={() => {
                        if (pId) {
                          setSelectedPharmacistId(pId);
                          refetchConversations();
                        }
                      }}
                      className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition ${
                        isSelected
                          ? "bg-teal-50/80 dark:bg-teal-950/40 border-l-4 border-teal-600"
                          : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {pName.charAt(0) || "P"}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                            {pName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {lastMsg}
                          </p>
                        </div>
                      </div>

                      {unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {unread}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat messages & response input (7 cols) */}
          <div className="md:col-span-7 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
            {selectedPharmacistId ? (
              <>
                {/* Active chat header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-800/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {activeChat?.pharmacistName || activeChat?.pharmacistId?.name || "Selected Pharmacist"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {activeChat?.pharmacistEmail || activeChat?.pharmacistId?.email || ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200/60 dark:border-teal-800">
                    Dispensary Partner
                  </span>
                </div>

                {/* Messages list */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/30">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <div className="relative w-32 h-28 flex items-center justify-center">
                        <div className="absolute bottom-2 w-24 h-7 bg-teal-100 dark:bg-teal-950/60 rounded-full" />
                        <Sparkles size={14} className="absolute top-2 right-4 text-emerald-400 animate-pulse" />
                        <div className="relative z-10 bg-gradient-to-br from-emerald-400 to-teal-600 text-white p-3 rounded-2xl shadow-lg border border-white/50">
                          <div className="flex items-center gap-1.5 px-2">
                            <span className="w-2 h-2 rounded-full bg-white" />
                            <span className="w-2 h-2 rounded-full bg-white" />
                            <span className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                        No messages yet
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Start communication with this pharmacist regarding prescriptions or orders.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg: any, idx: number) => {
                      const isMe = msg.senderRole === "admin";
                      const timeStr = msg.createdAt || msg.timestamp
                        ? new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "";

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                            <span>
                              {isMe ? "You (Super Admin)" : msg.senderName || "Pharmacist"}
                            </span>
                            <span>•</span>
                            <span>{timeStr}</span>
                          </div>

                          <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                              isMe
                                ? "bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-tr-xs"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs"
                            }`}
                          >
                            {msg.message || msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Action Chips for Admin */}
                <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> Quick reply:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        "Order Verified",
                        "Prescription and order verified. Please proceed with packaging and dispatch."
                      )
                    }
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition flex items-center gap-1 shrink-0 ${
                      selectedQuickAction === "Order Verified"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600"
                    }`}
                  >
                    <Package size={12} className="text-teal-600" />
                    <span>Order Verified</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        "Stock Update",
                        "Please update your inventory stock count for this medicine immediately."
                      )
                    }
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition flex items-center gap-1 shrink-0 ${
                      selectedQuickAction === "Stock Update"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600"
                    }`}
                  >
                    <Pill size={12} className="text-emerald-600" />
                    <span>Stock Update</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        "Delivery Assigned",
                        "Rider has been assigned for doorstep pickup from your dispensary."
                      )
                    }
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition flex items-center gap-1 shrink-0 ${
                      selectedQuickAction === "Delivery Assigned"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600"
                    }`}
                  >
                    <Truck size={12} className="text-purple-600" />
                    <span>Delivery Assigned</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickAction(
                        "Other Inquiry",
                        "Admin review required. Please provide more details on this case."
                      )
                    }
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition flex items-center gap-1 shrink-0 ${
                      selectedQuickAction === "Other Inquiry"
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600"
                    }`}
                  >
                    <Headphones size={12} className="text-blue-600" />
                    <span>Support Inquiry</span>
                  </button>
                </div>

                {/* Floating Pill Input Bar */}
                <form
                  onSubmit={(e) => handleSendMessage(e)}
                  className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-full px-3 py-1.5 shadow-xs focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition">
                    <button
                      type="button"
                      onClick={() => toast("Attachment support ready", { icon: "📎" })}
                      className="p-1.5 text-slate-400 hover:text-teal-600 transition cursor-pointer"
                    >
                      <Paperclip size={18} />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type message to pharmacist..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none px-1 py-1.5"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isSending}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-600/30 transition disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      <Send size={16} className="-ml-0.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 p-8 text-center">
                Select a pharmacist from the list to view chat and reply.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPharmacistChatModal;
