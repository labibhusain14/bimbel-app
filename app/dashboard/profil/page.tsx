"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfilData } from "@/app/actions/profil";

// ── Icons ───────────────────────────────────────────────────────
const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconCamera = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconTrophy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const IconCertificate = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const IconFire = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const achievements = [
  { id: 1, title: "Pembelajar Kilat", desc: "Selesaikan 5 tugas dalam 1 hari", icon: <IconFire />, bg: "bg-orange-100", text: "text-orange-600" },
  { id: 2, title: "Nilai Sempurna", desc: "Dapat nilai 100 di ujian akhir", icon: <IconTrophy />, bg: "bg-yellow-100", text: "text-yellow-600" },
];

type ProfilData = {
  full_name: string;
  email: string;
  phone: string;
  join_date: string;
  role: string;
  school_name: string;
  grade: string;
  stats: {
    activeClasses: number;
    tasksCompleted: number;
    averageScore: number;
    totalHours: number;
  };
  certificates: any[];
};

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<"ringkasan" | "sertifikat">("ringkasan");
  const [data, setData] = useState<ProfilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfilData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mb-4" />
        <p className="text-sm text-gray-500">Memuat profil...</p>
      </div>
    );
  }

  if (!data) return null;

  const initial = data.full_name ? data.full_name.charAt(0).toUpperCase() : "U";

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">

      {/* ── Header Profil ── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6 relative">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        </div>

        {/* Info Area */}
        <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row gap-6 sm:items-end relative -top-12">
          {/* Avatar */}
          <div className="relative inline-block mx-auto sm:mx-0 shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md flex items-center justify-center text-3xl font-bold text-white relative z-10">
              {initial}
            </div>
            <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition-colors z-20">
              <IconCamera />
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0 pt-12 sm:pt-0">
            <h1 className="text-2xl font-extrabold text-gray-900">{data.full_name}</h1>
            <p className="text-gray-500 text-sm font-medium capitalize">{data.role} Aktif • Bergabung sejak {data.join_date}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                {data.grade}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {data.school_name}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="sm:self-end text-center sm:text-right mt-4 sm:mt-0 pt-12 sm:pt-0 pb-2">
            <Link href="/dashboard/setelan" className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl transition-colors border border-gray-200">
              <IconEdit />
              Edit Profil
            </Link>
          </div>
        </div>
      </div>

      {/* ── Tab Switch ── */}
      <div className="flex items-center gap-1 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl p-1 w-fit mx-auto sm:mx-0">
        <button onClick={() => setActiveTab("ringkasan")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "ringkasan" ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          Ringkasan Belajar
        </button>
        <button onClick={() => setActiveTab("sertifikat")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "sertifikat" ? "bg-purple-50 text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          Sertifikat & Pencapaian
        </button>
      </div>

      {/* ── Content: Ringkasan ── */}
      {activeTab === "ringkasan" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Keseluruhan */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4">Statistik Belajar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-purple-600 mb-1">{data.stats.activeClasses}</p>
                  <p className="text-xs font-semibold text-gray-500">Kelas Aktif</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-emerald-600 mb-1">{data.stats.tasksCompleted}</p>
                  <p className="text-xs font-semibold text-gray-500">Tugas Selesai</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-blue-600 mb-1">{data.stats.averageScore}</p>
                  <p className="text-xs font-semibold text-gray-500">Rata-rata Nilai</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-amber-500 mb-1">{data.stats.totalHours}</p>
                  <p className="text-xs font-semibold text-gray-500">Total Jam</p>
                </div>
              </div>
            </div>

            {/* Informasi Pribadi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4">Informasi Pribadi</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm font-semibold text-gray-500">Email</div>
                  <div className="col-span-2 text-sm text-gray-800 font-medium">{data.email}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm font-semibold text-gray-500">No. Telepon</div>
                  <div className="col-span-2 text-sm text-gray-800 font-medium">{data.phone}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm font-semibold text-gray-500">Asal Sekolah</div>
                  <div className="col-span-2 text-sm text-gray-800 font-medium">{data.school_name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-sm font-semibold text-gray-500">Tingkat</div>
                  <div className="col-span-2 text-sm text-gray-800 font-medium">{data.grade}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Profil */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center justify-between">
                Kehadiran
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Bagus</span>
              </h2>

              {/* Circular Progress (Fake) */}
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-purple-500" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-gray-800">92%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">Hadir di 46 dari 50 sesi belajar</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Content: Sertifikat ── */}
      {activeTab === "sertifikat" && (
        <div className="space-y-8">
          {/* Sertifikat */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <IconCertificate />
              Sertifikat Kelulusan
            </h2>
            {data.certificates.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl py-12 text-center shadow-sm">
                <p className="text-gray-500 text-sm">Belum ada sertifikat yang diterbitkan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certificates.map((cert) => (
                  <div key={cert.id} className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer">
                    <div className={`bg-gradient-to-br ${cert.color} rounded-xl p-6 text-white relative overflow-hidden`}>
                      <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full" />
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-black/10 rounded-full" />
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Sertifikat Kelulusan</p>
                            <h3 className="text-xl font-bold">{cert.title}</h3>
                          </div>
                          <IconCertificate />
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <div>
                            <p className="text-white/80 text-xs">Diterbitkan: {cert.date}</p>
                            <p className="text-white/80 text-xs mt-0.5">Nilai Akhir: <span className="font-bold text-white">{cert.score}</span></p>
                          </div>
                          <button className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm group-hover:bg-gray-50 transition-colors">
                            Unduh PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pencapaian / Badges */}
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <IconTrophy />
              Badges Pencapaian (Contoh)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-center hover:border-purple-200 transition-colors">
                  <div className={`w-12 h-12 rounded-full ${ach.bg} ${ach.text} flex items-center justify-center shrink-0`}>
                    {ach.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{ach.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
