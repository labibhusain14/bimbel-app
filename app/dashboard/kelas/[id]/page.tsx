"use client";

import { useState } from "react";
import ClassMaterialTab from "@/components/ClassTabs/MaterialTab";
import ClassTaskTab from "@/components/ClassTabs/TaskTab";
import ClassMembersTab from "@/components/ClassTabs/MembersTab";

// Icons
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
// Dummy data for class
const dummyClass = {
  id: "1",
  name: "Desain UI/UX Profesional",
  instructor: "Rina Kusumawati",
  description: "Pelajari dasar-dasar desain UI/UX modern dengan tools profesional",
  coverColor: "from-purple-500 to-purple-600",
  icon: "R",
  students: 42,
  tasks: 3,
  materials: 12,
  // Jadwal kelas: hari, waktu, lokasi/mode
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
    { id: "orang", label: "Orang", icon: <IconUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-br ${dummyClass.coverColor} text-white`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Kembali"
            >
              <IconChevronLeft />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{dummyClass.name}</h1>
              <p className="text-purple-100">{dummyClass.instructor}</p>
            </div>
          </div>
          
          <p className="text-purple-50 max-w-2xl">
            {dummyClass.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-purple-100 text-sm mb-1">Anggota</p>
              <p className="text-2xl font-bold">{dummyClass.students}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-purple-100 text-sm mb-1">Materi</p>
              <p className="text-2xl font-bold">{dummyClass.materials}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-purple-100 text-sm mb-1">Tugas</p>
              <p className="text-2xl font-bold">{dummyClass.tasks}</p>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-6 max-w-xl">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <IconCalendar />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-100 font-semibold mb-2">Jadwal Kelas</p>
                <div className="grid grid-cols-1 gap-2">
                  {dummyClass.schedule.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm text-purple-50">
                      <div className="font-medium">{s.day} • {s.time}</div>
                      <div className="text-xs text-purple-100/80">{s.mode} · {s.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === "materi" && <ClassMaterialTab classId={dummyClass.id} />}
        {activeTab === "tugas" && <ClassTaskTab classId={dummyClass.id} />}
        {activeTab === "orang" && <ClassMembersTab classId={dummyClass.id} />}
      </div>
    </div>
  );
}
