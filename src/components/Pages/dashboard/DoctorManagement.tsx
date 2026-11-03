/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Stethoscope,
  Video,
  UserCheck,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  UserPlus,
  X,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";

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
  isActive: boolean;
};

type Consultation = {
  _id: string;
  consultationId: string;
  roomId: string;
  patient: {
    name: string;
    phone: string;
    email?: string;
    age: number;
    gender: string;
  };
  specialty: string;
  doctor?: Doctor;
  doctorName?: string;
  doctorDetails?: any;
  symptoms: string;
  consultationType: string;
  fee: number;
  status: "pending_assignment" | "assigned" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
};

const DoctorManagement = () => {
  const [activeTab, setActiveTab] = useState<"consultations" | "doctors">("consultations");

  // Data states
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Assign Doctor Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [assigningDoctorId, setAssigningDoctorId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Add Doctor Modal
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [addDoctorLoading, setAddDoctorLoading] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "General Physician",
    degrees: "MBBS (DMC), BCS (Health)",
    bmdcNumber: "BMDC-A-",
    experience: "5+ Years Experience",
    hospital: "Dhaka Medical College & Hospital",
    consultationFee: 300,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    availability: "Available" as const,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [consultRes, docRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/consultation`).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/doctor`).catch(() => null),
      ]);

      if (consultRes && consultRes.ok) {
        const cData = await consultRes.json();
        setConsultations(cData.data || []);
      }

      if (docRes && docRes.ok) {
        const dData = await docRes.json();
        setDoctors(dData.data || []);
      }
    } catch (err) {
      console.error("Error fetching admin doctor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    // Pre-select matching doctor if possible
    const matchingDoc = doctors.find(
      (d) => d.specialty.toLowerCase() === consultation.specialty.toLowerCase() && d.availability === "Available",
    );
    setAssigningDoctorId(matchingDoc ? matchingDoc._id : doctors[0]?._id || "");
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedConsultation || !assigningDoctorId) {
      toast.error("Please select a doctor to assign");
      return;
    }

    setAssignLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/consultation/assign/${selectedConsultation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: assigningDoctorId }),
      });

      if (!res.ok) throw new Error("Failed to assign doctor");

      toast.success("Doctor successfully assigned to consultation!", { icon: "🩺" });
      setIsAssignModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Assignment failed");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.bmdcNumber || !newDoctor.phone) {
      toast.error("Please fill in required fields");
      return;
    }

    setAddDoctorLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDoctor, isActive: true }),
      });

      if (!res.ok) throw new Error("Failed to create doctor profile");

      toast.success("New BMDC Doctor added successfully!", { icon: "👨‍⚕️" });
      setIsAddDoctorModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Doctor registration failed");
    } finally {
      setAddDoctorLoading(false);
    }
  };

  const handleSeedDoctors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/doctor/seed`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Default verified doctors seeded successfully!");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to seed doctors");
    }
  };

  const filteredConsultations = consultations.filter((item) => {
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesSearch =
      item.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.consultationId?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = consultations.filter((c) => c.status === "pending_assignment").length;
  const assignedCount = consultations.filter((c) => c.status === "assigned" || c.status === "in_progress").length;
  const completedCount = consultations.filter((c) => c.status === "completed").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Stethoscope size={16} />
            <span>PharmaDoor Telemedicine Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor Management & Assignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign licensed BMDC doctors to patient teleconsultation requests and manage hospital panel doctors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add New Doctor</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-teal-600" : ""} />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Pending Assignment</p>
            <h3 className="text-xl font-extrabold text-slate-900">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Video size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Assigned & Active</p>
            <h3 className="text-xl font-extrabold text-slate-900">{assignedCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Completed Consults</p>
            <h3 className="text-xl font-extrabold text-slate-900">{completedCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Panel BMDC Doctors</p>
            <h3 className="text-xl font-extrabold text-slate-900">{doctors.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("consultations")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "consultations"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Video size={14} />
          <span>Patient Consultations & Doctor Assignment</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("doctors")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "doctors"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Stethoscope size={14} />
          <span>Registered Doctors Panel ({doctors.length})</span>
        </button>
      </div>

      {/* TAB 1: Consultations & Doctor Assignment */}
      {activeTab === "consultations" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search patient, doctor, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Filter size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500 font-semibold">Status:</span>
              {["All", "pending_assignment", "assigned", "completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer capitalize ${
                    statusFilter === st
                      ? "bg-teal-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Consultation ID</th>
                    <th className="py-3.5 px-4">Patient Information</th>
                    <th className="py-3.5 px-4">Department / Symptoms</th>
                    <th className="py-3.5 px-4">Assigned Doctor</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        No consultation requests match this criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((item) => {
                      const isPending = item.status === "pending_assignment";
                      const isAssigned = item.status === "assigned" || item.status === "in_progress";
                      const isCompleted = item.status === "completed";

                      return (
                        <tr key={item._id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                            {item.consultationId}
                            <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{item.patient?.name}</span>
                            <span className="text-[11px] text-slate-500 block">
                              {item.patient?.phone} • {item.patient?.age}Y ({item.patient?.gender})
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px] inline-block mb-1">
                              {item.specialty}
                            </span>
                            <p className="text-[11px] text-slate-600 line-clamp-1 truncate">
                              {item.symptoms}
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            {item.doctorName ? (
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                                  {item.doctorName.slice(3, 4)}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 block text-xs">
                                    {item.doctorName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {item.doctorDetails?.degrees || "Verified Specialist"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 inline-flex items-center gap-1">
                                <AlertCircle size={12} />
                                <span>Doctor Not Assigned</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            {isPending && (
                              <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                Pending Doctor
                              </span>
                            )}
                            {isAssigned && (
                              <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                                Assigned / Ready
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                Consult Completed
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            {/* Assign / Reassign Button */}
                            <button
                              onClick={() => handleOpenAssignModal(item)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                                isPending
                                  ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                            >
                              {item.doctorName ? "Reassign Doctor" : "Assign Doctor"}
                            </button>

                            {/* Open Video Room button */}
                            <Link
                              to={`/consultation-room/${item.roomId}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition inline-flex items-center gap-1"
                              title="Join / Supervise Room"
                            >
                              <Video size={12} />
                              <span>Room</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Registered Doctors Panel */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">
              Verified BMDC Specialists on Panel ({doctors.length})
            </h3>
            {doctors.length === 0 && (
              <button
                onClick={handleSeedDoctors}
                className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-xs rounded-xl transition"
              >
                Seed Verified Doctors
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{doc.name}</h4>
                      <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.specialty}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.bmdcNumber}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-3 text-slate-600">
                    <p className="font-semibold">{doc.degrees}</p>
                    <p className="text-slate-500 text-[11px]">{doc.hospital}</p>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span>Fee: ৳{doc.consultationFee}</span>
                      <span className="text-emerald-600 font-bold">{doc.availability}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{doc.phone}</span>
                  <span className="text-teal-700 font-bold">Active Specialist</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Assign Doctor Modal */}
      {isAssignModalOpen && selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-teal-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Admin Consultation Assignment
                </span>
                <h3 className="text-base font-bold">
                  Assign Doctor for {selectedConsultation.patient?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Consultation Details */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Specialty Needed:</span>
                  <span className="font-extrabold text-teal-700">{selectedConsultation.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Patient Symptoms:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[240px]">
                    {selectedConsultation.symptoms}
                  </span>
                </div>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select BMDC Doctor to Assign *
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {doctors.map((doc) => {
                    const isSelected = assigningDoctorId === doc._id;
                    const matchesSpecialty =
                      doc.specialty.toLowerCase() === selectedConsultation.specialty.toLowerCase();

                    return (
                      <div
                        key={doc._id}
                        onClick={() => setAssigningDoctorId(doc._id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/70 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-slate-900">{doc.name}</h4>
                              {matchesSpecialty && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                  Match
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{doc.specialty} • {doc.hospital}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-teal-700">
                          ৳{doc.consultationFee}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmAssignment}
                  disabled={assignLoading || !assigningDoctorId}
                  className="w-2/3 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {assignLoading ? (
                    <span>Assigning...</span>
                  ) : (
                    <>
                      <UserCheck size={14} />
                      <span>Confirm & Assign Doctor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Doctor Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-teal-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Admin Registration
                </span>
                <h3 className="text-base font-bold">Register New BMDC Doctor</h3>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Kazi Shafiul Alam"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">BMDC Reg Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="BMDC-A-xxxxx"
                    value={newDoctor.bmdcNumber}
                    onChange={(e) => setNewDoctor({ ...newDoctor, bmdcNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty *</label>
                  <select
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600 bg-white"
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Pediatrician (Child Specialist)">Pediatrician</option>
                    <option value="Gynecologist & Obstetrics">Gynecologist & Obstetrics</option>
                    <option value="Dermatologist (Skin Care)">Dermatologist</option>
                    <option value="Gastrologist">Gastrologist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Degrees *</label>
                <input
                  type="text"
                  required
                  placeholder="MBBS, FCPS, MD"
                  value={newDoctor.degrees}
                  onChange={(e) => setNewDoctor({ ...newDoctor, degrees: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+88017xxxxxxxx"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newDoctor.consultationFee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={newDoctor.hospital}
                  onChange={(e) => setNewDoctor({ ...newDoctor, hospital: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-teal-600"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addDoctorLoading}
                  className="w-2/3 py-2.5 bg-slate-900 hover:bg-teal-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {addDoctorLoading ? "Registering..." : "Add Doctor to Panel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
