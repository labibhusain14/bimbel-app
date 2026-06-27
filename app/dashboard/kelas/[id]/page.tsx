"use client";

import { useState } from "react";
import ClassMaterialTab from "@/components/ClassTabs/MaterialTab";
import ClassTaskTab from "@/components/ClassTabs/TaskTab";
import ClassMembersTab from "@/components/ClassTabs/MembersTab";

// ── Icons ───────────────────────────────────────────────────────
const IconBook = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.5S6.5 28.747 12 28.747s10-4.745 10-10.247S17.5 6.253 12 6.253z" />
  </svg>
);

const IconCheckSquare = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354c3.866 0 7 1.79 7 4.024 0 2.235-3.134 4.025-7 4.025s-7-1.79-7-4.025c0-2.234 3.134-4.024 7-4.024zm0 10.978c-3.866 0-7 1.79-7 4.025 0 2.234 3.134 4.023 7 4.023s7-1.79 7-4.023c0-2.235-3.134-4.025-7-4.025zm0 4.646c-1.657 0-3.5.898-3.5 2.012 0 1.114 1.843 2.012 3.5 2.012s3.5-.898 3.5-2.012c0-1.114-1.843-2.012-3.5-2.012z" />
  </svg>
);

const IconChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconVideo = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const IconLocation = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ── Dummy data for class ─────────────────────────────────────────
const dummyClass = {
  id: "1",
  name: "Desain UI/UX Profesional",
  instructor: "Rina Kusumawati",
  description: "Pelajari dasar-dasar desain UI/UX modern dengan tools profesional seperti Figma dan prinsip-prinsip User Experience.",
  coverColor: "from-violet-600 to-indigo-700",
  badgeColor: "bg-violet-100 text-violet-700",
  category: "Seni & Desain",
  icon: "R",
  students: 42,
  tasks: 3,
  materials: 12,
  schedule: [
    { day: "Senin", time: "18:00 - 20:00", location: "Zoom (ID: 123-456)", mode: "Online" },
    { day: "Kamis", time: "18:00 - 20:00", location: "Ruang 201", mode: "Offline" },
  ],
};

type TabType = "materi" | "tugas" | "orang";

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>("materi");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "materi", label: "Materi", icon: <IconBook /> },
    { id: "tugas", label: "Tugas", icon: <IconCheckSquare /> },
    { id: "orang", label: "Anggota", icon: <IconUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header Banner ── */}
      <div className={`relative bg-gradient-to-r ${dummyClass.coverColor} pt-6 pb-24 px-4 sm:px-6 overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 blur-xl" />

        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-white/10 hover:bg-white/20 w-fit px-3 py-1.5 rounded-xl text-sm font-medium"
          >
            <IconChevronLeft /> Kembali
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6 justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3 backdrop-blur-sm border border-white/10">
                {dummyClass.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                {dummyClass.name}
              </h1>
              <p className="text-white/80 text-base font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {dummyClass.icon}
                </span>
                Pengajar: {dummyClass.instructor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Cards (Overlapping Banner) ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 w-full mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Main Info Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {dummyClass.description}
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Materi</p>
                <p className="text-2xl font-extrabold text-gray-900">{dummyClass.materials}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tugas</p>
                <p className="text-2xl font-extrabold text-gray-900">{dummyClass.tasks}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Anggota</p>
                <p className="text-2xl font-extrabold text-gray-900">{dummyClass.students}</p>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <IconCalendar />
              </span>
              Jadwal Kelas
            </h3>
            <div className="space-y-4">
              {dummyClass.schedule.map((s, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{s.day.slice(0, 3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                      <IconClock /> {s.time}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      {s.mode === "Online" ? <IconVideo /> : <IconLocation />}
                      <span className="truncate">{s.location}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "border-violet-600 text-violet-700"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeTab === "materi" && <ClassMaterialTab classId={dummyClass.id} />}
        {activeTab === "tugas" && <ClassTaskTab classId={dummyClass.id} />}
        {activeTab === "orang" && <ClassMembersTab classId={dummyClass.id} />}
      </div>
    </div>
  );
}
