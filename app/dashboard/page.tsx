"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JoinClassModal from "@/components/JoinClassModal";
import { getDashboardData } from "@/app/actions/dashboard";

// ── SVG Icon Components ────────────────────────────────────────
const IconBook = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const IconClipboard = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconAward = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconPalette = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);
const IconCode = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);
const IconPen = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const IconGlobe = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconBrush = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconChart = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// ── Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"kelas" | "pengumuman">("kelas");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    getDashboardData().then(data => {
      if (data) setDbData(data);
    });
  }, []);

  const getCourseIcon = (category: string) => {
    if (category.includes("Pemrograman")) return IconCode;
    if (category.includes("Menulis")) return IconPen;
    if (category.includes("Bahasa")) return IconGlobe;
    if (category.includes("Desain")) return IconBrush;
    return IconPalette;
  };

  const displayCourses = dbData?.courses.map((c: any) => ({
    ...c,
    CourseIcon: getCourseIcon(c.category)
  })) ?? [];

  const displayAnnouncements = dbData?.announcements ?? [];

  const pendingTaskCount = dbData?.pendingTaskCount ?? 0;
  const activeCount = dbData?.stats?.active ?? 0;
  const completedCount = dbData?.stats?.completed ?? 0;
  const certificateCount = dbData?.certificateCount ?? 0;

  const displayStats = [
    { label: "Kelas Aktif", value: activeCount, Icon: IconBook, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Tugas Pending", value: pendingTaskCount, Icon: IconClipboard, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Selesai", value: completedCount, Icon: IconCheck, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Sertifikat", value: certificateCount, Icon: IconAward, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100" },
  ];

  const userName = dbData?.user?.full_name || "...";
  const loading = !dbData;

  const handleJoinClass = (classCode: string) => {
    console.log("Joining class with code:", classCode);
    alert(`Berhasil bergabung dengan kelas! (Kode: ${classCode})`);
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-6 mb-6 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-purple-200 text-sm font-medium mb-1">Selamat datang kembali</p>
          <h1 className="text-white text-xl sm:text-2xl font-extrabold mb-1">
            {loading ? <span className="opacity-50">Memuat...</span> : userName}
          </h1>
          {pendingTaskCount > 0 ? (
            <p className="text-purple-300 text-sm">Kamu punya <span className="text-white font-semibold">{pendingTaskCount} tugas</span> yang belum dikumpulkan</p>
          ) : (
            <p className="text-purple-300 text-sm">Semangat belajar hari ini! Mari lanjutkan progres kelasmu.</p>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/dashboard/tugas" className="bg-white text-purple-700 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors shadow-sm">
              Lihat Tugas →
            </Link>
            <Link href="/dashboard/jadwal" className="bg-white/15 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-white/25 transition-colors border border-white/20">
              Jadwal Hari Ini
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {displayStats.map((s) => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}>
            <div className={`${s.bg} ${s.color} p-2.5 rounded-xl shrink-0`}>
              <s.Icon />
            </div>
            <div>
              <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switch */}
      <div className="flex items-center gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab("kelas")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "kelas" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          Kelas Saya
        </button>
        <button onClick={() => setActiveTab("pengumuman")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${activeTab === "pengumuman" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          Pengumuman
          <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
        </button>
      </div>

      {/* Kelas Cards */}
      {activeTab === "kelas" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCourses.map((course: any) => (
            <Link key={course.id} href={`/dashboard/kelas/${course.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5"
            >
              <div className={`bg-gradient-to-br ${course.gradient} p-5 relative overflow-hidden min-h-[110px] flex flex-col justify-between`}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-1/2 w-16 h-16 rounded-full bg-black/10 translate-y-1/2" />
                <div className="relative z-10">
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{course.category}</span>
                  <h3 className="text-white font-bold text-base mt-2 leading-tight line-clamp-2">{course.title}</h3>
                </div>
                <div className="absolute right-4 bottom-3 text-white opacity-20 group-hover:opacity-30 transition-opacity">
                  <course.CourseIcon className="w-12 h-12" />
                </div>
                <div className={`absolute right-4 top-4 w-10 h-10 rounded-full ${course.accent} border-2 border-white/50 flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {course.initial}
                </div>
              </div>

              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">{course.teacher}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {course.students} siswa
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {course.tasks} tugas
                  </span>
                </div>
              </div>

              <div className="px-4 pb-3 flex items-center justify-between border-t border-gray-50 pt-2">
                <div>
                  {course.tasks > 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{course.tasks} pending</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => e.preventDefault()} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  </button>
                  <button onClick={(e) => e.preventDefault()} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}

          <button onClick={() => setIsJoinModalOpen(true)} className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[200px] group">
            <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-500 group-hover:text-purple-600 transition-colors">Gabung Kelas Baru</p>
          </button>
        </div>
      )}

      {/* Pengumuman */}
      {activeTab === "pengumuman" && (
        <div className="flex flex-col gap-4 max-w-2xl">
          {displayAnnouncements.map((ann: any) => (
            <div key={ann.id} className={`bg-white rounded-2xl p-5 border-l-4 ${ann.accent} shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${ann.dot} mt-1.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide truncate">{ann.course}</p>
                    <span className="text-xs text-gray-400 shrink-0">{ann.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{ann.teacher}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{ann.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinClass}
      />
    </div>
  );
}
