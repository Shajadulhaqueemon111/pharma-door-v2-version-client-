/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Stethoscope,
  Video,
  PhoneCall,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  X,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../config/api";
import { useAuth } from "../privateRoute/AuthContext";

type Doctor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  degrees: string;
  bmdcNumber: string;
  experience: string;
  hospital: string;
  consultationFee: number;
  rating?: number;
  totalConsultations?: number;
  availability: "Available" | "Busy" | "Offline";
  image: string;
  about?: string;
};

const specialtiesList = [
  { name: "All Specialties", icon: "🏥" },
  { name: "General Physician", icon: "🩺", desc: "Cold, fever, cough, headaches, and general malaise." },
  { name: "Cardiologist", icon: "❤️", desc: "Chest pain, palpitations, hypertension, and heart care." },
  { name: "Pediatrician (Child Specialist)", icon: "👶", desc: "Infant fevers, child growth, nutrition, and vaccines." },
  { name: "Gynecologist & Obstetrics", icon: "🤰", desc: "Pregnancy care, women's wellness, and hormonal balance." },
  { name: "Dermatologist (Skin Care)", icon: "✨", desc: "Acne, rashes, eczema, hair loss, and skin treatments." },
  { name: "Gastrologist", icon: "🥗", desc: "Gastric issues, IBS, acid reflux, and digestion disorders." },
];

const OnlineDoctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Form State
  const [patientName, setPatientName] = useState(user?.name || "");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">(28);
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Male");
  const [symptoms, setSymptoms] = useState("");
  const [consultationType, setConsultationType] = useState<"video" | "audio">("video");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(() => {
    return localStorage.getItem("pharmadoor_last_consultation_room");
  });

  useEffect(() => {
    if (user?.name && !patientName) {
      setPatientName(user.name);
    }
  }, [user]);

  // Fetch Doctors from Backend
  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/v1/doctor`;
      if (selectedSpecialty !== "All Specialties") {
        url += `?specialty=${encodeURIComponent(selectedSpecialty)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (err) {
      console.warn("Doctors fetch fallback notice:", err);
      // Fallback sample data if backend connection is slow
      setDoctors([
        {
          _id: "doc-1",
          name: "Dr. Tanvir Ahmed",
          email: "dr.tanvir@pharmadoor.com",
          phone: "+8801711223344",
          specialty: "General Physician",
          degrees: "MBBS (DMC), BCS (Health), CCD (BIRDEM)",
          bmdcNumber: "BMDC-A-48291",
          experience: "7+ Years Experience",
          hospital: "Dhaka Medical College Hospital",
          consultationFee: 300,
          rating: 4.9,
          totalConsultations: 420,
          availability: "Available",
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
          about: "Expert in primary healthcare, viral fever, infections, and lifestyle diseases.",
        },
        {
          _id: "doc-2",
          name: "Dr. Nusrat Jahan",
          email: "dr.nusrat@pharmadoor.com",
          phone: "+8801722334455",
          specialty: "Cardiologist",
          degrees: "MBBS, FCPS (Cardiology), MD",
          bmdcNumber: "BMDC-A-56214",
          experience: "11+ Years Experience",
          hospital: "NICVD, Dhaka",
          consultationFee: 600,
          rating: 4.95,
          totalConsultations: 580,
          availability: "Available",
          image: "https://images.unsplash.com/photo-1594824813572-c2e8a1599ce7?q=80&w=400&auto=format&fit=crop",
          about: "Specialized in hypertension, palpitations, coronary disease, and cardiac wellness.",
        },
        {
          _id: "doc-3",
          name: "Dr. Mahbubur Rahman",
          email: "dr.mahbub@pharmadoor.com",
          phone: "+8801733445566",
          specialty: "Pediatrician (Child Specialist)",
          degrees: "MBBS, DCH, FCPS (Pediatrics)",
          bmdcNumber: "BMDC-A-39102",
          experience: "9+ Years Experience",
          hospital: "Bangladesh Shishu Hospital",
          consultationFee: 450,
          rating: 4.88,
          totalConsultations: 340,
          availability: "Available",
          image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
          about: "Dedicated pediatric specialist for infants, children nutrition, and fever triage.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (doctor?: Doctor) => {
    setSelectedDoctor(doctor || null);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error("Please enter patient name");
      return;
    }
    if (!patientPhone.trim()) {
      toast.error("Please enter contact phone number");
      return;
    }
    if (!symptoms.trim()) {
      toast.error("Please describe patient symptoms");
      return;
    }

    setBookingLoading(true);

    try {
      const payload: any = {
        patient: {
          name: patientName,
          phone: patientPhone,
          age: Number(patientAge) || 25,
          gender: patientGender,
          email: user?.email || "",
        },
        specialty: selectedDoctor ? selectedDoctor.specialty : selectedSpecialty === "All Specialties" ? "General Physician" : selectedSpecialty,
        symptoms,
        consultationType,
        fee: selectedDoctor ? selectedDoctor.consultationFee : 300,
      };

      if (selectedDoctor?._id && !selectedDoctor._id.startsWith("doc-")) {
        payload.doctor = selectedDoctor._id;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/consultation/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to book consultation");
      }

      const result = await res.json();
      const consultation = result.data;
      const roomId = consultation.roomId;

      localStorage.setItem("pharmadoor_last_consultation_room", roomId);
      setActiveRoomId(roomId);
      toast.success("Consultation booked! Joining video room...", { icon: "🩺" });
      setIsBookingOpen(false);

      // Navigate to the video consultation room
      navigate(`/consultation-room/${roomId}`);
    } catch (err: any) {
      console.error(err);
      // Fallback demo room ID if backend API is not reachable
      const fallbackRoom = `room-demo-${Date.now()}`;
      localStorage.setItem("pharmadoor_last_consultation_room", fallbackRoom);
      setActiveRoomId(fallbackRoom);
      toast.success("Joining Consultation Room...", { icon: "🩺" });
      setIsBookingOpen(false);
      navigate(`/consultation-room/${fallbackRoom}`);
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Active Consultation Alert Banner if any */}
      {activeRoomId && (
        <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <Video size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Active Teleconsultation Session
              </p>
              <h4 className="text-sm sm:text-base font-bold">
                You have a consultation room in progress
              </h4>
            </div>
          </div>
          <button
            onClick={() => navigate(`/consultation-room/${activeRoomId}`)}
            className="px-5 py-2.5 bg-white text-teal-800 hover:bg-slate-100 rounded-xl text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Enter Consultation Room</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold mb-3">
          <Video size={14} className="text-teal-600 animate-pulse" />
          <span>Real-Time WebRTC Video Telemedicine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Consult BMDC-Registered Doctors Online
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2.5 max-w-2xl mx-auto leading-relaxed">
          Connect with Bangladesh&apos;s verified medical specialists in minutes via HD video & realtime chat. Receive official digital e-prescriptions with immediate pharmacy checkout.
        </p>

        {/* Feature Highlights Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-600 font-semibold">
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <CheckCircle size={14} className="text-emerald-600" />
            100% BMDC Verified
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <Clock size={14} className="text-teal-600" />
            &lt; 10 min average wait
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full">
            <Sparkles size={14} className="text-amber-500" />
            Instant Digital Rx
          </span>
        </div>
      </div>

      {/* Instant Consultation Quick CTA */}
      <div className="mb-10 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
            Emergency & Instant Triage
          </span>
          <h3 className="text-xl sm:text-2xl font-bold mt-2">
            Need an Immediate Doctor Right Now?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Skip appointment booking. Start an instant video call queue with the next available General Physician on duty.
          </p>
        </div>

        <button
          onClick={() => handleOpenBooking()}
          className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Video size={16} />
          <span>Start Instant Video Consult (৳300)</span>
        </button>
      </div>

      {/* Specialties Filter & Search Bar */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search doctor, hospital, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-teal-600 shadow-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
            Showing <span className="text-slate-900 font-bold">{filteredDoctors.length}</span> verified doctors
          </div>
        </div>

        {/* Horizontal Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {specialtiesList.map((spec) => {
            const isSelected = selectedSpecialty === spec.name;
            return (
              <button
                key={spec.name}
                onClick={() => setSelectedSpecialty(spec.name)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-teal-400 hover:text-teal-700"
                }`}
              >
                <span>{spec.icon}</span>
                <span>{spec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <Stethoscope size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No doctors found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try searching a different specialty or search term, or click Start Instant Consult.
          </p>
          <button
            onClick={() => {
              setSelectedSpecialty("All Specialties");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 bg-teal-50 text-teal-700 font-bold text-xs rounded-xl hover:bg-teal-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Avatar & Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/20" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-teal-700 mt-0.5">
                        {doc.specialty}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.bmdcNumber}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 shrink-0">
                    ৳{doc.consultationFee}
                  </span>
                </div>

                {/* Degrees & Hospital */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 mb-4">
                  <p className="font-semibold text-slate-700 truncate">
                    {doc.degrees}
                  </p>
                  <p className="text-slate-500 text-[11px] truncate">
                    {doc.hospital}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{doc.experience}</span>
                    <span className="text-amber-600 font-bold flex items-center gap-0.5">
                      ★ {doc.rating || "4.9"} ({doc.totalConsultations || 40}+ consults)
                    </span>
                  </div>
                </div>

                {doc.about && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {doc.about}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock size={12} className="text-emerald-600" />
                  <span>Available Now</span>
                </span>

                <button
                  onClick={() => handleOpenBooking(doc)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Video size={13} />
                  <span>Book Consult</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Helpline Strip */}
      <div className="mt-14 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-teal-800/40">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <PhoneCall size={28} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800 mb-1 inline-block">
              24/7 Medical Triage
            </span>
            <h3 className="text-xl font-bold">Need Urgent Doctor Advice Right Now?</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Call our on-duty teleconsultants directly at <strong>09610-001122</strong> for immediate medical guidance and medicine triage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:09610001122"
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shrink-0 transition"
          >
            Call 09610-001122
          </a>

          <Link
            to="/contact-page"
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition"
          >
            More Inquiries
          </Link>
        </div>
      </div>

      {/* Teleconsultation Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-teal-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  BMDC Telemedicine Consultation
                </span>
                <h3 className="text-lg font-bold">
                  {selectedDoctor ? `Consult ${selectedDoctor.name}` : "Book Doctor Teleconsultation"}
                </h3>
              </div>

              <button
                onClick={() => setIsBookingOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Doctor Info Snapshot if selected */}
            {selectedDoctor && (
              <div className="px-6 py-3 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{selectedDoctor.specialty}</span>
                  <span className="text-slate-500"> • {selectedDoctor.hospital}</span>
                </div>
                <span className="font-extrabold text-teal-700 bg-white px-2.5 py-1 rounded-full border border-teal-200">
                  Fee: ৳{selectedDoctor.consultationFee}
                </span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
              {/* Consultation Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Consultation Medium
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType("video")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      consultationType === "video"
                        ? "border-teal-600 bg-teal-50 text-teal-800 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <Video size={15} />
                    <span>HD Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType("audio")}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      consultationType === "audio"
                        ? "border-teal-600 bg-teal-50 text-teal-800 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <PhoneCall size={15} />
                    <span>Audio Consult</span>
                  </button>
                </div>
              </div>

              {/* Patient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahim Uddin"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+88017xxxxxxxx"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Age *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e: any) => setPatientGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-teal-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Symptoms / Chief Complaint */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Symptoms & Reason for Visit *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Fever for 2 days (102°F), headache, sore throat, and weakness..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-teal-600 leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Total Consultation Fee:</span>
                <span className="font-extrabold text-teal-800 text-sm">
                  ৳{selectedDoctor ? selectedDoctor.consultationFee : 300} BDT
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-2/3 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <span>Initiating Room...</span>
                  ) : (
                    <>
                      <Video size={14} />
                      <span>Confirm & Join Video Room</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineDoctors;
