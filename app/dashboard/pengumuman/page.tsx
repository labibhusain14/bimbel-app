"use client";

// ── Icons ───────────────────────────────────────────────────────
const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Dummy Data ──────────────────────────────────────────────────
const announcements = [
  {
    id: 1,
    title: "Libur Nasional Hari Raya",
    sender: "Admin ghaitsmartedu",
    time: "2 jam lalu",
    content: "Diingatkan kembali bahwa seluruh sesi kelas online dan offline pada tanggal merah minggu depan akan diliburkan. Jadwal pengganti akan diinfokan oleh guru masing-masing.",
    type: "system", // general info
    read: false,
    color: "blue"
  },
  {
    id: 2,
    title: "Tugas Akhir: Desain UI/UX",
    sender: "Rina Kusumawati",
    time: "Kemarin, 14:00",
    content: "Silakan cek halaman tugas. Saya sudah mengunggah kriteria penilaian untuk tugas akhir pembuatan prototype E-Commerce. Mohon dibaca dengan teliti karena bobotnya besar.",
    type: "course",
    course: "Desain UI/UX Profesional",
    read: false,
    color: "violet"
  },
  {
    id: 3,
    title: "Materi React Hooks",
    sender: "Budi Santoso",
    time: "3 hari lalu",
    content: "Slide presentasi dan video rekaman sesi tentang React Hooks & State Management sudah bisa diunduh di dashboard materi. Siapkan pertanyaan untuk sesi Q&A besok ya!",
    type: "course",
    course: "Pemrograman Web Modern",
    read: true,
    color: "teal"
  },
  {
    id: 4,
    title: "Perubahan Jadwal: Bahasa Inggris",
    sender: "Ahmad Fauzan",
    time: "1 minggu lalu",
    content: "Kelas Bahasa Inggris Intensif hari Kamis ini dimajukan menjadi jam 08:00 pagi. Mohon persiapkan diri dan hadir tepat waktu.",
    type: "course",
    course: "Bahasa Inggris Intensif",
    read: true,
    color: "amber"
  }
];

const colorVariants: Record<string, { bg: string, text: string, border: string, dot: string, unreadBg: string }> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500",   unreadBg: "bg-blue-50/30" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500", unreadBg: "bg-violet-50/40" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500",   unreadBg: "bg-teal-50/40" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500",  unreadBg: "bg-amber-50/40" },
};

export default function PengumumanPage() {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Pengumuman</h1>
          <p className="text-sm text-gray-500 mt-1">Pembaruan terbaru dari kelas dan sistem.</p>
        </div>
        <button className="text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors">
          Tandai semua dibaca
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-3">
        {announcements.map((item) => {
          const v = colorVariants[item.color];
          return (
            <div key={item.id} className={`bg-white rounded-2xl p-5 border border-gray-100 transition-all duration-200 ${item.read ? "shadow-sm opacity-75" : `shadow-md border-l-4 ${v.border} ${v.unreadBg}`}`}>
              
              <div className="flex gap-4">
                {/* Icon Column */}
                <div className="shrink-0 pt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${v.bg} ${v.text}`}>
                    {item.type === "system" ? <IconInfo /> : <IconBell />}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                    <h2 className={`text-base font-bold ${item.read ? "text-gray-700" : "text-gray-900"}`}>
                      {item.title}
                    </h2>
                    <span className="text-xs font-medium text-gray-400 shrink-0">{item.time}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-600">{item.sender}</span>
                    {item.course && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${v.bg} ${v.text}`}>
                          {item.course}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Unread indicator dot */}
              {!item.read && (
                <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-purple-600 shadow-sm" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
