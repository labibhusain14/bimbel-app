"use client";

import { useState } from "react";
import { createClass } from "@/app/actions/admin-kelas";
import Link from "next/link";
import { useRouter } from "next/navigation";

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354c3.866 0 7 1.79 7 4.024 0 2.235-3.134 4.025-7 4.025s-7-1.79-7-4.025c0-2.234 3.134-4.024 7-4.024z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const gradients = [
  "from-violet-500 to-purple-700",
  "from-cyan-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-green-600",
];

export default function AdminClassList({ initialClasses, options }: { initialClasses: any[], options: any }) {
  const [classes, setClasses] = useState(initialClasses);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject_id: "",
    teacher_id: "",
    schedule_day: "Senin",
    start_time: "08:00",
    end_time: "10:00",
    lokasi: "Online",
    join_code: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Auto-generate join code if empty
    let finalCode = formData.join_code;
    if (!finalCode) {
      finalCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const res = await createClass({ ...formData, join_code: finalCode });
    if (res.success) {
      setModalOpen(false);
      setFormData({
        name: "",
        subject_id: "",
        teacher_id: "",
        schedule_day: "Senin",
        start_time: "08:00",
        end_time: "10:00",
        lokasi: "Online",
        join_code: ""
      });
      router.refresh(); // Refresh page to get updated list
    } else {
      alert("Gagal membuat kelas: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Kelas</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola seluruh kelas, jadwal, dan guru pengajar.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors shadow-sm"
        >
          <IconPlus /> Buat Kelas Baru
        </button>
      </div>

      {/* ── Class Grid ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialClasses.map((c: any, index: number) => {
          const subjectName = Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name;
          const teacherName = Array.isArray(c.users) ? c.users[0]?.full_name : c.users?.full_name;
          const studentCount = Array.isArray(c.student_classrooms) ? c.student_classrooms[0]?.count : c.student_classrooms?.count;
          const gradient = gradients[index % gradients.length];
          
          return (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradient}`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${gradient} text-white`}>
                  {subjectName || "Umum"}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                  <IconUsers /> {studentCount || 0}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{c.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Guru: <span className="font-semibold text-gray-700">{teacherName || "Belum Ditentukan"}</span></p>
              
              {c.join_code && (
                <div className="text-xs text-gray-500 mb-2 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100 w-fit">
                  Code: <span className="font-mono font-bold text-gray-700 tracking-wider">{c.join_code}</span>
                </div>
              )}
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <IconCalendar />
                  <span>{c.schedule_day || "-"} <span className="mx-1">•</span> {c.start_time ? c.start_time.substring(0,5) : ""} - {c.end_time ? c.end_time.substring(0,5) : ""}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {initialClasses.length === 0 && (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
          Belum ada kelas yang dibuat.
        </div>
      )}

      {/* ── Create Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Buat Kelas Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Kelas</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Misal: Matematika XII IPA 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mata Pelajaran</label>
                  <select required
                    value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Pilih Mapel...</option>
                    {options.subjects.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Guru Pengajar</label>
                  <select required
                    value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Pilih Guru...</option>
                    {options.teachers.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Hari</label>
                  <select 
                    value={formData.schedule_day} onChange={e => setFormData({...formData, schedule_day: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mulai</label>
                  <input type="time" required
                    value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Selesai</label>
                  <input type="time" required
                    value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Lokasi</label>
                  <input 
                    type="text" 
                    value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Online / Ruang A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Join Code</label>
                  <input 
                    type="text" 
                    value={formData.join_code} onChange={e => setFormData({...formData, join_code: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none uppercase"
                    placeholder="Kosongkan u/ Auto"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70">
                  {loading ? "Menyimpan..." : "Simpan Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
