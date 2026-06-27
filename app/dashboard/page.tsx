"use client";

import { useState } from "react";
import Link from "next/link";

// ── Sample data ────────────────────────────────────────────────
const courses = [
  {
    id: 1,
    title: "Desain UI/UX Profesional",
    teacher: "Rina Kusumawati",
    category: "Seni & Desain",
    gradient: "from-violet-500 to-purple-700",
    accent: "bg-violet-500",
    initial: "R",
    students: 42,
    tasks: 3,
    icon: "🎨",
  },
  {
    id: 2,
    title: "Pemrograman Web Modern",
    teacher: "Budi Santoso",
    category: "Pemrograman",
    gradient: "from-cyan-500 to-teal-600",
    accent: "bg-teal-500",
    initial: "B",
    students: 38,
    tasks: 5,
    icon: "💻",
  },
  {
    id: 3,
    title: "Menulis Kreatif & Copywriting",
    teacher: "Sari Dewi",
    category: "Menulis",
    gradient: "from-rose-500 to-pink-600",
    accent: "bg-rose-500",
    initial: "S",
    students: 29,
    tasks: 2,
    icon: "✍️",
  },
  {
    id: 4,
    title: "Bahasa Inggris Intensif",
    teacher: "Ahmad Fauzan",
    category: "Bahasa",
    gradient: "from-amber-500 to-orange-600",
    accent: "bg-amber-500",
    initial: "A",
    students: 55,
    tasks: 7,
    icon: "🌍",
  },
  {
    id: 5,
    title: "Ilustrasi Digital",
    teacher: "Maya Putri",
    category: "Seni & Desain",
    gradient: "from-indigo-500 to-blue-600",
    accent: "bg-indigo-500",
    initial: "M",
    students: 31,
    tasks: 1,
    icon: "🖌️",
  },
  {
    id: 6,
    title: "Data Science Dasar",
    teacher: "Reza Pratama",
    category: "Pemrograman",
    gradient: "from-emerald-500 to-green-600",
    accent: "bg-emerald-500",
    initial: "R",
    students: 47,
    tasks: 4,
    icon: "📊",
  },
];

const announcements = [
  {
    id: 1,
    course: "Desain UI/UX Profesional",
    teacher: "Rina Kusumawati",
    message: "Tugas minggu ini: buat prototype low-fidelity untuk aplikasi e-commerce. Deadline Jumat 23:59.",
    time: "2 jam lalu",
    accent: "border-violet-400",
    dot: "bg-violet-500",
  },
  {
    id: 2,
    course: "Pemrograman Web Modern",
    teacher: "Budi Santoso",
    message: "Materi baru sudah diunggah: React Hooks & State Management. Silakan dipelajari sebelum sesi besok.",
    time: "5 jam lalu",
    accent: "border-teal-400",
    dot: "bg-teal-500",
  },
  {
    id: 3,
    course: "Bahasa Inggris Intensif",
    teacher: "Ahmad Fauzan",
    message: "Reminder: Ujian tengah semester minggu depan. Materi dari chapter 1–5.",
    time: "1 hari lalu",
    accent: "border-amber-400",
    dot: "bg-amber-500",
  },
];

const navItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: "Beranda",
    href: "/dashboard",
    active: true,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: "Jadwal",
    href: "/dashboard/jadwal",
    active: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    label: "Tugas",
    href: "/dashboard/tugas",
    active: false,
    badge: 12,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    label: "Pengumuman",
    href: "/dashboard/pengumuman",
    active: false,
    badge: 3,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    label: "Profil",
    href: "/dashboard/profil",
    active: false,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Setelan",
    href: "/dashboard/setelan",
    active: false,
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"kelas" | "pengumuman">("kelas");

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar (desktop) ── */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"} shrink-0 sticky top-0 h-screen`}
      >
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">G</div>
              <span className="text-purple-700 font-bold text-base">ghaitsmartedu</span>
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                item.active
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
              }`}
            >
              <span className={`shrink-0 ${item.active ? "text-purple-600" : ""}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className="ml-auto text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.badge && !sidebarOpen && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-gray-100 pt-4">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="text-sm font-medium">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Header ── */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 gap-2">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari kelas, tugas, atau pengumuman..."
                className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notification */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-md transition-shadow">
              M
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">

          {/* Welcome Banner */}
          <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl p-6 mb-6 overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />
            <div className="relative z-10">
              <p className="text-purple-200 text-sm font-medium mb-1">Selamat datang kembali 👋</p>
              <h1 className="text-white text-xl sm:text-2xl font-extrabold mb-1">Mohammad Labib</h1>
              <p className="text-purple-300 text-sm">Kamu punya <span className="text-white font-semibold">12 tugas</span> yang perlu diselesaikan minggu ini</p>
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
            {[
              { label: "Kelas Aktif", value: "6", icon: "📚", color: "bg-purple-50 text-purple-700", border: "border-purple-100" },
              { label: "Tugas Pending", value: "12", icon: "📝", color: "bg-amber-50 text-amber-700", border: "border-amber-100" },
              { label: "Selesai", value: "38", icon: "✅", color: "bg-emerald-50 text-emerald-700", border: "border-emerald-100" },
              { label: "Sertifikat", value: "2", icon: "🏆", color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
            ].map((s) => (
              <div key={s.label} className={`bg-white border ${s.border} rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow`}>
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className={`text-xl font-extrabold ${s.color.split(" ")[1]}`}>{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Switch */}
          <div className="flex items-center gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("kelas")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "kelas" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Kelas Saya
            </button>
            <button
              onClick={() => setActiveTab("pengumuman")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${activeTab === "pengumuman" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Pengumuman
              <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
            </button>
          </div>

          {/* ── Kelas Cards ── */}
          {activeTab === "kelas" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/dashboard/kelas/${course.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group border border-gray-100 hover:-translate-y-0.5"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-br ${course.gradient} p-5 relative overflow-hidden min-h-[110px] flex flex-col justify-between`}>
                    {/* BG pattern */}
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-1/2 w-16 h-16 rounded-full bg-black/10 translate-y-1/2" />

                    <div className="relative z-10">
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">{course.category}</span>
                      <h3 className="text-white font-bold text-base mt-2 leading-tight line-clamp-2">{course.title}</h3>
                    </div>

                    {/* Emoji icon */}
                    <div className="absolute right-4 bottom-4 text-3xl opacity-40 group-hover:opacity-60 transition-opacity">{course.icon}</div>

                    {/* Avatar */}
                    <div className={`absolute right-4 top-4 w-10 h-10 rounded-full ${course.accent} border-2 border-white/50 flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {course.initial}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{course.teacher}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {course.students} siswa
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        {course.tasks} tugas
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 pb-3 flex items-center justify-between border-t border-gray-50 pt-2">
                    <div className="flex items-center gap-1">
                      {course.tasks > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          {course.tasks} pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Materi"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                      </button>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Lebih lanjut"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Add Class Card */}
              <button className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[200px] group">
                <div className="w-12 h-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-500 group-hover:text-purple-600 transition-colors">Gabung Kelas Baru</p>
              </button>
            </div>
          )}

          {/* ── Pengumuman ── */}
          {activeTab === "pengumuman" && (
            <div className="flex flex-col gap-4 max-w-2xl">
              {announcements.map((ann) => (
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
        </main>
      </div>

      {/* ── Bottom Nav (mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 px-2 py-2 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${item.active ? "text-purple-600" : "text-gray-400"}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge && (
              <span className="absolute top-0.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
