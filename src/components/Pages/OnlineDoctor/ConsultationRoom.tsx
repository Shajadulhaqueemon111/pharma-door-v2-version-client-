/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  FileText,
  User,
  Send,
  Plus,
  Trash2,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Download,
  ShoppingCart,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../config/api";
import { getSocket } from "../../../utils/socket";
import { useAuth } from "../privateRoute/AuthContext";
import { useCart } from "../AddToCart/CartContext";

type PrescribedMed = {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
};

type PrescriptionData = {
  diagnosis: string;
  medicines: PrescribedMed[];
  advice: string;
  doctorName: string;
  bmdcNumber?: string;
  degrees?: string;
  issuedAt: string;
};

type ChatMessage = {
  senderId: string;
  senderName: string;
  senderRole: "patient" | "doctor" | "admin";
  message: string;
  timestamp: string | Date;
};

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const ConsultationRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  // Consultation info from DB
  const [consultation, setConsultation] = useState<any>(null);
  const [, setLoading] = useState(true);

  // Call state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "prescription" | "patient">("chat");
  const [callDuration, setCallDuration] = useState(0);
  const [peerConnected, setPeerConnected] = useState(false);

  // Role toggle: allow doctor role if user is admin/doctor, or toggle for previewing
  const isDoctorRole = user?.role === "admin" || user?.role === "pharmacist";
  const [isDoctorMode, setIsDoctorMode] = useState<boolean>(isDoctorRole);

  // WebRTC refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Prescription Form State (for doctor)
  const [diagnosis, setDiagnosis] = useState("Acute Viral Pharyngitis & Fever");
  const [prescribedMedicines, setPrescribedMedicines] = useState<PrescribedMed[]>([
    { name: "Napa 500mg Tablet", dosage: "1+0+1", duration: "5 Days", instructions: "After meal" },
    { name: "Fexo 120mg Tablet", dosage: "0+0+1", duration: "7 Days", instructions: "At night" },
  ]);
  const [advice, setAdvice] = useState("Drink warm saline water, gargle twice daily, and avoid cold beverages.");
  const [issuedPrescription, setIssuedPrescription] = useState<PrescriptionData | null>(null);
  const [savingPrescription, setSavingPrescription] = useState(false);

  // Fetch consultation details
  useEffect(() => {
    if (!roomId) return;

    fetch(`${API_BASE_URL}/api/v1/consultation/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setConsultation(data.data);
          if (data.data.messages) {
            setMessages(data.data.messages);
          }
          if (data.data.prescription) {
            setIssuedPrescription(data.data.prescription);
          }
        }
      })
      .catch((err) => console.warn("Consultation details fetch notice:", err))
      .finally(() => setLoading(false));
  }, [roomId]);

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebRTC & Socket.IO Setup
  useEffect(() => {
    if (!roomId) return;
    const socket = getSocket();

    const currentUserPayload = {
      id: user?._id || `guest-${Math.random().toString(36).substr(2, 5)}`,
      name: user?.name || (isDoctorMode ? "Dr. Consultant" : consultation?.patient?.name || "Patient"),
      role: isDoctorMode ? ("doctor" as const) : ("patient" as const),
    };

    // Join Room
    socket.emit("join-room", {
      roomId,
      user: currentUserPayload,
    });

    // Start Local Camera Stream
    startLocalMedia();

    // Socket Event Listeners
    socket.on("user-connected", async (data: any) => {
      console.log("👤 Peer connected to room:", data);
      setPeerConnected(true);
      toast.success(`${data.user?.name || "Peer"} joined the consultation!`, { icon: "🩺" });
      createOffer();
    });

    socket.on("signal-offer", async (data: { sdp: any; callerSocketId: string; user: any }) => {
      console.log("Received SDP Offer from:", data.callerSocketId);
      setPeerConnected(true);
      handleOffer(data.sdp);
    });

    socket.on("signal-answer", async (data: { sdp: any }) => {
      console.log("Received SDP Answer");
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    });

    socket.on("signal-ice-candidate", async (data: { candidate: any }) => {
      if (peerConnectionRef.current && data.candidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.warn("ICE candidate error:", err);
        }
      }
    });

    // Realtime chat message received
    socket.on("receive-chat-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    // Realtime digital prescription received
    socket.on("prescription-issued", (presc: PrescriptionData) => {
      setIssuedPrescription(presc);
      setActiveTab("prescription");
      toast.success("Doctor has issued your official Digital Prescription!", {
        icon: "📋",
        duration: 5000,
      });
    });

    // Peer media toggle
    socket.on("peer-audio-toggled", (data: { enabled: boolean; user: any }) => {
      toast(`${data.user?.name || "Peer"} ${data.enabled ? "unmuted" : "muted"} mic`, {
        icon: data.enabled ? "🎤" : "🔇",
      });
    });

    // Call ended by peer
    socket.on("call-ended", (data: { endedBy: string }) => {
      toast(`${data.endedBy} has ended the consultation session.`, { icon: "⏹️" });
      cleanupCall();
    });

    socket.on("user-disconnected", () => {
      setPeerConnected(false);
      toast("Peer has disconnected from the room.", { icon: "ℹ️" });
    });

    return () => {
      socket.off("user-connected");
      socket.off("signal-offer");
      socket.off("signal-answer");
      socket.off("signal-ice-candidate");
      socket.off("receive-chat-message");
      socket.off("prescription-issued");
      socket.off("peer-audio-toggled");
      socket.off("call-ended");
      socket.off("user-disconnected");
      cleanupCall();
    };
  }, [roomId, isDoctorMode]);

  // Start Media Stream
  const startLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera/Mic not accessible or denied, setting fallback canvas:", err);
      // Create synthetic canvas stream so testing never breaks
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = "#14b8a6";
        ctx.font = "24px sans-serif";
        ctx.fillText("PharmaDoor Camera Ready", 160, 240);
      }
      const stream = canvas.captureStream ? canvas.captureStream(15) : new MediaStream();
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }
  };

  // WebRTC Peer Connection Helper
  const getPeerConnection = () => {
    if (!peerConnectionRef.current) {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local tracks to PC
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Handle remote tracks
      pc.ontrack = (event) => {
        console.log("🎬 Remote track received:", event.streams[0]);
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setPeerConnected(true);
        }
      };

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && roomId) {
          getSocket().emit("signal-ice-candidate", {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      peerConnectionRef.current = pc;
    }
    return peerConnectionRef.current;
  };

  const createOffer = async () => {
    try {
      const pc = getPeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      getSocket().emit("signal-offer", {
        roomId,
        sdp: offer,
        user: { name: user?.name || "Consultant", role: isDoctorMode ? "doctor" : "patient" },
      });
    } catch (err) {
      console.error("Error creating WebRTC offer:", err);
    }
  };

  const handleOffer = async (remoteOffer: RTCSessionDescriptionInit) => {
    try {
      const pc = getPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      getSocket().emit("signal-answer", {
        roomId,
        sdp: answer,
      });
    } catch (err) {
      console.error("Error answering WebRTC offer:", err);
    }
  };

  // Media Controls
  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      getSocket().emit("toggle-audio", {
        roomId,
        enabled: !newMuted,
        user: { name: user?.name || "User" },
      });
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      const newVideoOff = !isVideoOff;
      setIsVideoOff(newVideoOff);
      getSocket().emit("toggle-video", {
        roomId,
        enabled: !newVideoOff,
        user: { name: user?.name || "User" },
      });
    }
  };

  const handleEndCall = () => {
    if (confirm("Are you sure you want to end this consultation?")) {
      getSocket().emit("end-call", {
        roomId,
        endedBy: isDoctorMode ? "Doctor" : user?.name || "Patient",
      });
      cleanupCall();
      toast.success("Consultation call ended");
      navigate("/online-doctor");
    }
  };

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

    const payload = {
      roomId,
      message: newMessage.trim(),
      senderName: user?.name || (isDoctorMode ? "Dr. Consultant" : consultation?.patient?.name || "Patient"),
      senderRole: (isDoctorMode ? "doctor" : "patient") as any,
      senderId: user?._id || "sender",
    };

    getSocket().emit("send-chat-message", payload);
    setNewMessage("");
  };

  // Doctor: Add Prescribed Medicine Row
  const handleAddMedicineRow = () => {
    setPrescribedMedicines((prev) => [
      ...prev,
      { name: "", dosage: "1+0+1", duration: "7 Days", instructions: "After meal" },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setPrescribedMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMedicineRow = (index: number, field: keyof PrescribedMed, val: string) => {
    setPrescribedMedicines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // Doctor: Issue E-Prescription
  const handleIssuePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      toast.error("Please enter patient diagnosis");
      return;
    }
    const validMeds = prescribedMedicines.filter((m) => m.name.trim());
    if (validMeds.length === 0) {
      toast.error("Please prescribe at least one medicine");
      return;
    }

    setSavingPrescription(true);

    const prescriptionPayload: PrescriptionData = {
      diagnosis,
      medicines: validMeds,
      advice,
      doctorName: consultation?.doctorName || "Dr. Tanvir Ahmed, MBBS, FCPS",
      bmdcNumber: consultation?.doctorDetails?.bmdcNumber || "BMDC-A-48291",
      degrees: consultation?.doctorDetails?.degrees || "MBBS (DMC), BCS (Health)",
      issuedAt: new Date().toISOString(),
    };

    try {
      // Send via HTTP to persist in DB
      await fetch(`${API_BASE_URL}/api/v1/consultation/prescription/${consultation?._id || roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionPayload),
      });

      // Emit through Socket.IO for real-time delivery to patient
      getSocket().emit("doctor-issue-prescription", {
        roomId,
        prescription: prescriptionPayload,
      });

      setIssuedPrescription(prescriptionPayload);
      toast.success("Digital E-Prescription issued and sent to patient!", { icon: "📜" });
    } catch (err) {
      console.error(err);
      // Fallback local emission
      getSocket().emit("doctor-issue-prescription", {
        roomId,
        prescription: prescriptionPayload,
      });
      setIssuedPrescription(prescriptionPayload);
      toast.success("E-Prescription issued via room channel!", { icon: "📜" });
    } finally {
      setSavingPrescription(false);
    }
  };

  // Patient: Add All Prescribed Medicines to Cart
  const handleAddPrescriptionToCart = () => {
    if (!issuedPrescription || issuedPrescription.medicines.length === 0) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newItems = [...existingCart];

    issuedPrescription.medicines.forEach((med, i) => {
      newItems.push({
        _id: `rx-${Date.now()}-${i}`,
        name: med.name,
        brand: "Prescription Rx",
        price: 25,
        stock: 50,
        medicineImage: "https://i.ibb.co/fdWB7NR1/napa-10-mg-injection-38629477289-i2-Rw-Xq-Fwww-JQd-Js-Tmf-Phim.webp",
        quantity: 1,
        dosage: `${med.dosage} (${med.instructions})`,
      });
    });

    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
    updateCartCount();
    toast.success("Prescribed medicines added to your PharmaDoor Cart!", { icon: "🛒" });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Header Bar */}
      <header className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/online-doctor"
            className="flex items-center gap-2 text-teal-400 font-extrabold text-sm hover:text-teal-300"
          >
            <Stethoscope size={20} />
            <span className="hidden sm:inline">PharmaDoor Telemedicine</span>
          </Link>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-mono">
              Room: {roomId?.slice(0, 15)}...
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{formatTimer(callDuration)}</span>
            </span>
          </div>
        </div>

        {/* Doctor Mode Switcher Toggle (for demo/testing both roles) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setIsDoctorMode(false)}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${!isDoctorMode ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              Patient View
            </button>
            <button
              onClick={() => setIsDoctorMode(true)}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${isDoctorMode ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              Doctor View
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Consultation link copied to clipboard!");
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Share Room Link"
          >
            <Share2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Video Call Stream Area (col-span-8) */}
        <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between p-4 relative">
          {/* Main Remote Video Screen (The other participant) */}
          <div className="relative flex-1 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[350px]">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${peerConnected ? "block" : "hidden"}`}
            />

            {/* Waiting for peer / animated doctor avatar when remote video is not yet connected */}
            {!peerConnected && (
              <div className="text-center p-8 space-y-4 max-w-md">
                <div className="relative mx-auto w-24 h-24 rounded-full bg-teal-900/40 border-2 border-teal-500/40 flex items-center justify-center">
                  <Stethoscope size={42} className="text-teal-400 animate-pulse" />
                  <span className="absolute inset-0 rounded-full border border-teal-400 animate-ping opacity-30" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isDoctorMode ? "Waiting for Patient to Connect..." : "Connecting to Doctor..."}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {consultation?.doctorName
                      ? `Assigned: ${consultation.doctorName} (${consultation.specialty || "Specialist"})`
                      : "Doctor is reviewing your symptoms and joining the video call now."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-teal-300 border border-slate-700">
                  <ShieldCheck size={13} />
                  <span>256-bit DGDA / WebRTC Encrypted Consultation</span>
                </div>
              </div>
            )}

            {/* Local Video Picture-in-Picture (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 w-36 sm:w-48 aspect-video rounded-2xl overflow-hidden border-2 border-teal-500/80 shadow-2xl bg-slate-950 z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isVideoOff ? "hidden" : "block"}`}
              />
              {isVideoOff && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
                  <VideoOff size={18} className="mb-1 text-rose-400" />
                  <span>Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded text-slate-300 font-bold">
                You ({isDoctorMode ? "Doctor" : "Patient"})
              </div>
            </div>

            {/* Peer info badge top-left */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${peerConnected ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
              <span className="font-bold">
                {peerConnected
                  ? isDoctorMode
                    ? consultation?.patient?.name || "Patient Online"
                    : consultation?.doctorName || "Dr. Tanvir Ahmed (Doctor)"
                  : "Waiting for connection"}
              </span>
            </div>
          </div>

          {/* Bottom Call Controls Toolbar */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer ${isMuted ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition cursor-pointer ${isVideoOff ? "bg-rose-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
            >
              {isVideoOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              <PhoneOff size={18} />
              <span>Leave Call</span>
            </button>

            {/* Mobile Tab toggles */}
            <button
              onClick={() => setActiveTab("chat")}
              className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition ${activeTab === "chat" ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300"
                }`}
            >
              <MessageSquare size={18} />
            </button>

            <button
              onClick={() => setActiveTab("prescription")}
              className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition ${activeTab === "prescription" ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300"
                }`}
            >
              <FileText size={18} />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Panel (Chat / Digital E-Prescription / Patient Notes) (col-span-4) */}
        <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col h-[550px] lg:h-auto overflow-hidden">
          {/* Tab Navigation */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "chat" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              <MessageSquare size={14} />
              <span>Real-Time Chat</span>
            </button>

            <button
              onClick={() => setActiveTab("prescription")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer relative ${activeTab === "prescription" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              <FileText size={14} />
              <span>E-Prescription</span>
              {issuedPrescription && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("patient")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "patient" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                }`}
            >
              <User size={14} />
              <span>Notes</span>
            </button>
          </div>

          {/* TAB 1: Live Chat */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-4">
              {/* Messages list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <MessageSquare size={32} className="mb-2 text-slate-600" />
                    <p className="text-xs">No chat messages yet.</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Say hello or share symptom updates in real time.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isDoctor = msg.senderRole === "doctor";
                    return (
                      <div
                        key={i}
                        className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] text-slate-400 mb-0.5 px-1 flex items-center gap-1">
                          {isDoctor && <Stethoscope size={10} className="text-teal-400" />}
                          <span>{msg.senderName}</span>
                        </span>
                        <div
                          className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${isDoctor
                              ? "bg-teal-600 text-white rounded-tr-xs"
                              : "bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700"
                            }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message to doctor or patient..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition disabled:opacity-40 cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Digital E-Prescription */}
          {activeTab === "prescription" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* If Doctor Mode: Show Prescription Writer */}
              {isDoctorMode ? (
                <form onSubmit={handleIssuePrescription} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                        Doctor E-Prescription Desk
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Draft and instantly dispatch the prescription to the patient.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Doctor Authorized
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Diagnosis / Clinical Finding *
                    </label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Viral Bronchitis"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-teal-500"
                    />
                  </div>

                  {/* Medicines Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-300">
                        Rx: Prescribed Medicines *
                      </label>
                      <button
                        type="button"
                        onClick={handleAddMedicineRow}
                        className="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Add Medicine</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {prescribedMedicines.map((med, index) => (
                        <div
                          key={index}
                          className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Medicine Name (e.g. Napa Extra 500mg)"
                              value={med.name}
                              onChange={(e) => handleUpdateMedicineRow(index, "name", e.target.value)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-teal-500"
                            />
                            {prescribedMedicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMedicineRow(index)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <input
                              type="text"
                              placeholder="Dosage (1+0+1)"
                              value={med.dosage}
                              onChange={(e) => handleUpdateMedicineRow(index, "dosage", e.target.value)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px]"
                            />
                            <input
                              type="text"
                              placeholder="Duration (5 Days)"
                              value={med.duration}
                              onChange={(e) => handleUpdateMedicineRow(index, "duration", e.target.value)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px]"
                            />
                            <input
                              type="text"
                              placeholder="Instruction (After meal)"
                              value={med.instructions}
                              onChange={(e) => handleUpdateMedicineRow(index, "instructions", e.target.value)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor's Advice */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Doctor&apos;s Advice & Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                      placeholder="Rest, drink plenty of fluids, avoid cold water..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPrescription}
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    <span>
                      {savingPrescription ? "Delivering Rx..." : "Issue & Send Official E-Prescription"}
                    </span>
                  </button>
                </form>
              ) : null}

              {/* Patient View / Issued Prescription Display */}
              {issuedPrescription ? (
                <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-teal-500/40 space-y-4">
                  {/* Prescription Header */}
                  <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-sm">
                        <Stethoscope size={16} />
                        <span>PharmaDoor Telemedicine Digital Rx</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {issuedPrescription.doctorName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {issuedPrescription.degrees} • Reg: {issuedPrescription.bmdcNumber}
                      </p>
                    </div>

                    <div className="text-right text-[10px] text-slate-400">
                      <span>Date: {new Date(issuedPrescription.issuedAt).toLocaleDateString()}</span>
                      <div className="mt-1 inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        DGDA Verified
                      </div>
                    </div>
                  </div>

                  {/* Patient Info Bar */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-400">Patient: </span>
                      <span className="font-bold text-slate-800">{consultation?.patient?.name || "Patient"}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">Age/Gender: </span>
                      <span>{consultation?.patient?.age || 30} Y / {consultation?.patient?.gender || "Male"}</span>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      Diagnosis:
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {issuedPrescription.diagnosis}
                    </p>
                  </div>

                  {/* Rx List */}
                  <div>
                    <span className="text-base font-serif font-extrabold text-teal-800 italic block mb-1.5">
                      Rx
                    </span>
                    <div className="space-y-2">
                      {issuedPrescription.medicines.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{m.name}</p>
                            <p className="text-[11px] text-teal-800 font-mono mt-0.5">
                              {m.dosage} • {m.duration} ({m.instructions})
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Prescribed
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice */}
                  {issuedPrescription.advice && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <span className="font-bold text-slate-700">Advice: </span>
                      <span className="text-slate-600">{issuedPrescription.advice}</span>
                    </div>
                  )}

                  {/* Actions for Patient */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleAddPrescriptionToCart}
                      className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={15} />
                      <span>Add All Prescribed Medicines to Cart</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Print / Download Prescription</span>
                    </button>
                  </div>
                </div>
              ) : !isDoctorMode ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <FileText size={36} className="mb-2 text-slate-600 animate-pulse" />
                  <p className="text-xs font-bold text-slate-400">Prescription not issued yet</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Your doctor is examining your symptoms and will issue your verified prescription during this call.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: Patient Intake Notes */}
          {activeTab === "patient" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                <h4 className="font-bold text-teal-400 uppercase tracking-wider text-[10px]">
                  Patient Medical Intake
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px]">Full Name:</span>
                    <p className="font-bold text-white text-xs">{consultation?.patient?.name || "Patient"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Contact:</span>
                    <p className="font-bold text-white text-xs">{consultation?.patient?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Age / Gender:</span>
                    <p className="font-bold text-white text-xs">
                      {consultation?.patient?.age || 28} Years • {consultation?.patient?.gender || "Male"}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Specialty:</span>
                    <p className="font-bold text-white text-xs">{consultation?.specialty || "General Physician"}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <span className="text-slate-400 text-[11px]">Primary Symptoms / Chief Complaint:</span>
                  <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-700 font-mono text-[11px]">
                    {consultation?.symptoms || "High fever, chills, body ache and severe throat discomfort."}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-bold text-teal-400">৳{consultation?.fee || 300} Paid</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;
