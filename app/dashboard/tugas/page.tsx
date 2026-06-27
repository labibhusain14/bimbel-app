"use client";

import { useState, useMemo } from "react";

// ── Icons ───────────────────────────────────────────────────────
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconAlert = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUpload = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const IconFile = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// ── Dummy Data ──────────────────────────────────────────────────
type TaskStatus = "pending" | "late" | "submitted" | "graded";

interface TaskItem {
  id: number;
  title: string;
  course: string;
  deadline: string; // "Besok, 23:59"
  deadlineDate: Date;
  status: TaskStatus;
  score?: number;
  accent: string;
}

const dummyTasks: TaskItem[] = [
  // Belum Selesai (Pending/Late)
  { id: 1, title: "Prototype Low-Fidelity E-Commerce", course: "Desain UI/UX Profesional", deadline: "Hari ini, 23:59", deadlineDate: new Date(Date.now() + 8 * 3600000), status: "pending", accent: "violet" },
  { id: 2, title: "Implementasi React Context API", course: "Pemrograman Web Modern", deadline: "Besok, 12:00", deadlineDate: new Date(Date.now() + 24 * 3600000), status: "pending", accent: "teal" },
  { id: 3, title: "Esai: Masa Depan AI di Pendidikan", course: "Menulis Kreatif & Copywriting", deadline: "Kemarin, 23:59", deadlineDate: new Date(Date.now() - 24 * 3600000), status: "late", accent: "rose" },
  
  // Selesai (Submitted/Graded)
  { id: 4, title: "Latihan Tenses & Grammar", course: "Bahasa Inggris Intensif", deadline: "3 Hari Lalu", deadlineDate: new Date(Date.now() - 72 * 3600000), status: "graded", score: 95, accent: "amber" },
  { id: 5, title: "Vector Art Karakter", course: "Ilustrasi Digital", deadline: "Minggu Lalu", deadlineDate: new Date(Date.now() - 168 * 3600000), status: "submitted", accent: "indigo" },
  { id: 6, title: "Analisis Dataset Titanic", course: "Data Science Dasar", deadline: "Minggu Lalu", deadlineDate: new Date(Date.now() - 200 * 3600000), status: "graded", score: 88, accent: "emerald" },
];

const colorMap: Record<string, { bg: string, border: string, text: string }> = {
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700" },
  teal:    { bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700" },
  rose:    { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700" },
  indigo:  { bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
};

// ── Component ──────────────────────────────────────────────────
export default function TugasPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "selesai">("pending");

  const filteredTasks = useMemo(() => {
    if (activeTab === "pending") {
      return dummyTasks.filter(t => t.status === "pending" || t.status === "late").sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
    } else {
      return dummyTasks.filter(t => t.status === "submitted" || t.status === "graded").sort((a, b) => b.deadlineDate.getTime() - a.deadlineDate.getTime());
    }
  }, [activeTab]);

  const pendingCount = dummyTasks.filter(t => t.status === "pending" || t.status === "late").length;
  const selesaiCount = dummyTasks.length - pendingCount;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Daftar Tugas</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola dan kumpulkan semua tugasmu di satu tempat.</p>
      </div>

      {/* ── Tabs & Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit">
          <button onClick={() => setActiveTab("pending")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === "pending" ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Belum Selesai
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "pending" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}>
              {pendingCount}
            </span>
          </button>
          <button onClick={() => setActiveTab("selesai")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === "selesai" ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            Selesai
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "selesai" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}>
              {selesaiCount}
            </span>
          </button>
        </div>

        {/* Dropdown Filter Simulasi */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Urutkan:</span>
          <select className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm">
            <option>Tenggat Terdekat</option>
            <option>Paling Baru Ditambahkan</option>
            <option>Berdasarkan Kelas</option>
          </select>
        </div>
      </div>

      {/* ── Task List ── */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <IconCheckCircle />
          </div>
          <p className="text-base font-bold text-gray-800">Semua tugas sudah selesai!</p>
          <p className="text-sm text-gray-400 mt-1">Kamu bisa bersantai atau baca materi tambahan.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTasks.map((task) => {
            const colors = colorMap[task.accent];
            const isLate = task.status === "late";
            
            return (
              <div key={task.id} className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col sm:flex-row gap-5 sm:items-center ${isLate ? "border-l-4 border-l-red-500" : ""}`}>
                
                {/* Icon Circle */}
                <div className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}>
                  <IconFile />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>
                      {task.course}
                    </span>
                    {isLate && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        Terlambat
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 truncate mb-2 group-hover:text-purple-700 transition-colors">
                    {task.title}
                  </h3>
                  
                  {/* Deadline row */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className={`flex items-center gap-1.5 ${isLate ? "text-red-600" : "text-gray-500"}`}>
                      <IconClock />
                      {task.deadline}
                    </div>
                    {task.status === "submitted" && (
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <IconCheckCircle />
                        Menunggu Penilaian
                      </div>
                    )}
                    {task.status === "graded" && (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <IconCheckCircle />
                        Dinilai
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 mt-2 sm:mt-0 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  {/* Score Display */}
                  {task.status === "graded" && (
                    <div className="text-center sm:text-right px-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nilai</p>
                      <p className="text-xl font-extrabold text-green-600 leading-none">{task.score}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  {(task.status === "pending" || task.status === "late") && (
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-purple-200">
                      <IconUpload />
                      Kumpulkan
                    </button>
                  )}
                  
                  {(task.status === "submitted" || task.status === "graded") && (
                    <button className="flex-1 sm:flex-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                      Lihat Detail
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
