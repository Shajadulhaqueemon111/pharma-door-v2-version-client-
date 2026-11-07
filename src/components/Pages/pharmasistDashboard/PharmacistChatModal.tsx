/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  ShieldCheck,
  Paperclip,
  Package,
  Pill,
  Truck,
  Headphones,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  useGetMySupportChatQuery,
  useSendSupportMessageMutation,
} from "../../../redux/api/supportChatApi";
import { useAuth } from "../privateRoute/AuthContext";
import { SOCKET_SERVER_URL } from "../../../config/api";
import io from "socket.io-client";
import toast from "react-hot-toast";

interface PharmacistChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

export const PharmacistChatModal: React.FC<PharmacistChatModalProps> = ({
  isOpen,
  onClose,
  onUnreadChange,
}) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null);

  const { data: chatResponse, refetch } = useGetMySupportChatQuery(undefined, {
    skip: !isOpen && !user?._id,
    pollingInterval: isOpen ? 5000 : 30000,
  });

  const [sendSupportMessage, { isLoading: isSending }] = useSendSupportMessageMutation();

  const conversation = chatResponse?.data;
  const messages = conversation?.messages || [];

  // Update unread count callback
  useEffect(() => {
    if (chatResponse?.data?.unreadForPharmacist !== undefined && onUnreadChange) {
      onUnreadChange(chatResponse.data.unreadForPharmacist);
    }
  }, [chatResponse, onUnreadChange]);

  // Socket.IO real-time message receiver
  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-user-room", { userId: user._id });
      socket.emit("join-pharmacist-chat", { pharmacistId: user._id });
    });

    socket.on("receive-pharmacist-chat", (data: any) => {
      refetch();
      if (data.senderRole === "admin") {
        toast(`Admin message: ${(data.message || data.text)?.slice(0, 35)}...`, {
          icon: "💬",
        });
      }
    });

    socket.on("unread-chat-count", (data: any) => {
      if (typeof data.unreadCount === "number" && onUnreadChange) {
        onUnreadChange(data.unreadCount);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, refetch, onUnreadChange]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isOpen]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend || isSending) return;

    try {
      setInputText("");
      setSelectedQuickAction(null);

      await sendSupportMessage({
        text: textToSend,
        message: textToSend,
      }).unwrap();

      if (socketRef.current) {
        socketRef.current.emit("send-pharmacist-chat", {
          pharmacistId: user?._id,
          text: textToSend,
          message: textToSend,
          senderRole: "pharmacist",
        });
      }

      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  const handleQuickAction = (topic: string, promptTemplate: string) => {
    setSelectedQuickAction(topic);
    setInputText(promptTemplate);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg sm:max-w-xl rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col h-[640px] max-h-[92vh] overflow-hidden transition-all">
        {/* PREMIUM EMERALD GRADIENT HEADER */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0 shadow-md">
          {/* Subtle decorative circles */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-28 w-32 h-32 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Support Desk"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center justify-center transition cursor-pointer z-10"
          >
            <X size={18} />
          </button>

          <div className="flex items-center justify-between relative z-0">
            {/* Left brand details */}
            <div className="space-y-1.5 max-w-[280px] sm:max-w-xs">
              <div className="flex items-center gap-2.5">
                {/* PharmaDoor Heart Icon Badge */}
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
                    <span className="text-[10px] font-bold uppercase tracking-wider   text-emerald-300  flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Support
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-100/90 font-medium">
                    Your Health, Our Priority
                  </p>
                </div>
              </div>

              {/* Online Response indicator */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
                <span>Online • Usually replies within 1-2 minutes</span>
              </div>
            </div>

            {/* Right Doctor 3D Avatar Illustration */}
            <div className="hidden sm:block relative shrink-0 pr-6">
              {/* Doctor Avatar with speech bubble */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
                    alt="PharmaDoor Medical Specialist"
                    className="w-full h-full object-cover rounded-full border-2 border-white/60"
                  />
                </div>
                {/* Medicine pill bubble badge */}
                <div className="absolute -top-2 -left-2 bg-white text-teal-700 p-1.5 rounded-full shadow-lg border border-slate-100">
                  <Pill size={14} className="text-emerald-600 rotate-45" />
                </div>
              </div>
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
              Messages are private and strictly visible only to you and system admins.
            </p>
          </div>
        </div>

        {/* MESSAGES BODY / EMPTY STATE */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.length === 0 ? (
            /* 3D-styled Empty State matching user reference image */
            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 animate-fade-in">
              {/* 3D speech bubble & pedestal graphic */}
              <div className="relative w-36 h-32 flex items-center justify-center">
                {/* Circular Pedestal */}
                <div className="absolute bottom-2 w-28 h-8 bg-gradient-to-b from-teal-100 to-teal-200/80 dark:from-teal-900/60 dark:to-teal-950/80 rounded-full shadow-md border border-teal-200/60 dark:border-teal-700/50" />
                {/* Specks & sparkles */}
                <Sparkles size={16} className="absolute top-2 right-4 text-emerald-400 animate-pulse" />
                <Sparkles size={12} className="absolute bottom-6 left-2 text-teal-400 animate-pulse" />

                {/* 3D speech bubble with 3 dots */}
                <div className="relative z-10 -mt-2 bg-gradient-to-br from-emerald-400 to-teal-600 text-white p-3.5 rounded-2xl shadow-xl shadow-teal-600/25 border-2 border-white/50 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 px-2 py-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                  </div>
                </div>

                {/* Medicine capsule leaning on pedestal */}
                <div className="absolute bottom-4 right-5 z-20 w-5 h-7 rounded-full bg-gradient-to-t from-teal-600 to-emerald-300 border-2 border-white shadow-md transform rotate-45" />
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                No messages yet.
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Have any inventory discrepancy, order conflict, or system issue? Message the admin team here anytime.
              </p>
            </div>
          ) : (
            messages.map((msg: any, idx: number) => {
              const isMe = msg.senderRole === "pharmacist";
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
                    <span>{isMe ? "You (Dispensary)" : msg.senderName || "System Admin"}</span>
                    <span>•</span>
                    <span>{timeStr}</span>
                  </div>

                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${isMe
                      ? "bg-teal-600 text-white rounded-tr-xs"
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

        {/* QUICK ACTIONS ROW */}
        <div className="px-4 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="text-amber-500">⚡</span> Quick Actions
            </span>
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5 cursor-pointer hover:text-teal-600 transition">
              Need help with? <ChevronDown size={13} />
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Order Issue */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "Order Issue",
                  "[Order Issue] I need assistance regarding an active prescription order."
                )
              }
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${selectedQuickAction === "Order Issue"
                ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-teal-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
            >
              <Package size={14} className="text-teal-600" />
              <span>Order Issue</span>
            </button>

            {/* Medicine Info */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "Medicine Info",
                  "[Medicine Info] Inquiry about drug stock, batch or DGDA verification."
                )
              }
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${selectedQuickAction === "Medicine Info"
                ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-teal-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
            >
              <Pill size={14} className="text-emerald-600" />
              <span>Medicine Info</span>
            </button>

            {/* Delivery */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "Delivery",
                  "[Delivery] Urgent dispatch or rider update needed for patient delivery."
                )
              }
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${selectedQuickAction === "Delivery"
                ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-teal-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
            >
              <Truck size={14} className="text-teal-600" />
              <span>Delivery</span>
            </button>

            {/* Other Issue */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "Other Issue",
                  "[Other Issue] I want to report a technical / store discrepancy: "
                )
              }
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${selectedQuickAction === "Other Issue"
                ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-teal-400 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
            >
              <Headphones size={14} className="text-teal-600" />
              <span>Other Issue</span>
            </button>
          </div>
        </div>

        {/* FLOATING PILL-SHAPED INPUT BAR */}
        <form
          onSubmit={(e) => handleSend(e)}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-full px-3 py-1.5 shadow-xs focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition">
            {/* Attachment paperclip */}
            <button
              type="button"
              onClick={() => toast("Attachment support enabled for screenshots & reports", { icon: "📎" })}
              className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
              title="Attach prescription or image"
            >
              <Paperclip size={18} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none px-1 py-1.5"
            />

            {/* Circular Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-teal-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              title="Send Message"
            >
              <Send size={16} className="-ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PharmacistChatModal;
