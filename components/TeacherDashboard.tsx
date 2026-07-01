"use client";

import Link from "next/link";

// ── SVG Icon Components ────────────────────────────────────────
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354c3.866 0 7 1.79 7 4.024 0 2.235-3.134 4.025-7 4.025s-7-1.79-7-4.025c0-2.234 3.134-4.024 7-4.024zm0 10.978c-3.866 0-7 1.79-7 4.025 0 2.234 3.134 4.023 7 4.023s7-1.79 7-4.023c0-2.235-3.134-4.025-7-4.025zm0 4.646c-1.657 0-3.5.898-3.5 2.012 0 1.114 1.843 2.012 3.5 2.012s3.5-.898 3.5-2.012c0-1.114-1.843-2.012-3.5-2.012z" />
  </svg>
);
const IconBook = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const IconCheckSquare = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconTime = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function TeacherDashboard({ data }: { data: any }) {
  if (!data) return <div className="p-8 text-center text-gray-500">Memuat dashboard...</div>;

  const { user, courses, stats, recentSubmissions, todaysClasses } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 sm:py-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>

        <div className="flex-1 relative z-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Selamat datang, Ibu {user.full_name?.split(" ")[0] || "Hebat"}!
          </h1>
          <p className="text-purple-100 max-w-xl text-sm sm:text-base mb-6">
            Hari ini ada {stats.todaysClassesCount} kelas yang perlu diajar dan {stats.unreviewedCount} tugas yang belum Anda nilai.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link href="/dashboard/guru/kelas" className="px-5 py-2.5 bg-white text-purple-700 font-bold rounded-xl text-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
              Kelola Kelas
            </Link>
            <Link href="/dashboard/guru/penilaian" className="px-5 py-2.5 bg-purple-500/30 backdrop-blur-md text-white font-bold rounded-xl text-sm hover:bg-purple-500/50 transition-all border border-purple-400/30">
              Mulai Penilaian
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <IconBook />, label: "Kelas Aktif", value: stats.activeClasses, color: "text-blue-600", bg: "bg-blue-50" },
          { icon: <IconUsers />, label: "Total Siswa", value: stats.totalStudents, color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: <IconCheckSquare />, label: "Belum Dinilai", value: stats.unreviewedCount, color: "text-rose-600", bg: "bg-rose-50" },
          { icon: <IconCalendar />, label: "Kelas Hari Ini", value: stats.todaysClassesCount, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Class List ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Kelas yang Anda Ajar</h2>
            <Link href="/dashboard/guru/kelas" className="text-sm font-bold text-purple-600 hover:text-purple-700">
              Lihat Semua
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((c: any) => (
              <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col h-full">
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${c.gradient}`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${c.gradient} text-white`}>
                    {c.category}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    <IconUsers /> {c.students}
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{c.title}</h3>
                {c.joinCode && (
                  <div className="text-xs text-gray-500 mb-2 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100 w-fit">
                    Code: <span className="font-mono font-bold text-gray-700 tracking-wider">{c.joinCode}</span>
                  </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <IconCalendar />
                    <span>{c.scheduleDay} <span className="mx-1">•</span> {c.scheduleTime}</span>
                  </div>
                </div>
                <Link href={`/dashboard/guru/kelas/${c.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Detail kelas</span>
                </Link>
              </div>
            ))}

            {courses.length === 0 && (
              <div className="col-span-2 bg-white rounded-2xl p-8 border border-gray-100 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <IconBook />
                </div>
                <h3 className="text-gray-800 font-bold mb-1">Belum Ada Kelas</h3>
                <p className="text-sm text-gray-500">Anda belum ditugaskan untuk mengajar di kelas manapun.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar (Right) ── */}
        <div className="space-y-6">

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Jadwal Hari Ini
            </h2>
            <div className="space-y-4">
              {todaysClasses.length > 0 ? (
                todaysClasses.map((c: any) => (
                  <div key={c.id} className="flex gap-3 items-center">
                    <div className="w-12 text-center shrink-0">
                      <div className="text-xs font-bold text-gray-800">{c.scheduleTime.split(' - ')[0]}</div>
                    </div>
                    <div className="w-1 h-10 bg-amber-200 rounded-full shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{c.title}</p>
                      <p className="text-xs text-gray-500 truncate">{c.lokasi}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl">
                  Tidak ada jadwal mengajar hari ini.
                </p>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Perlu Dinilai</h2>
              <Link href="/dashboard/guru/penilaian" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                Semua
              </Link>
            </div>

            <div className="space-y-3">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((s: any) => (
                  <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {s.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                        {s.studentName}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {s.assignmentTitle}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <IconTime />
                        {new Date(s.submittedAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <IconCheckSquare />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Hore! Semua sudah dinilai.</p>
                  <p className="text-xs text-gray-500 mt-1">Tidak ada tugas tertunda.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
