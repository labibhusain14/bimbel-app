"use client";

import Link from "next/link";

const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354c3.866 0 7 1.79 7 4.024 0 2.235-3.134 4.025-7 4.025s-7-1.79-7-4.025c0-2.234 3.134-4.024 7-4.024zm0 10.978c-3.866 0-7 1.79-7 4.025 0 2.234 3.134 4.023 7 4.023s7-1.79 7-4.023c0-2.235-3.134-4.025-7-4.025z" />
  </svg>
);

const IconChalkboard = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

export default function AdminDashboard({ data }: { data: any }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data bimbel, pengguna, dan kelas.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconUsers />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Siswa</p>
          <h2 className="text-3xl font-bold text-gray-800">{data.totalStudents}</h2>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconUsers />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Guru</p>
          <h2 className="text-3xl font-bold text-gray-800">{data.totalTeachers}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconChalkboard />
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Kelas</p>
          <h2 className="text-3xl font-bold text-gray-800">{data.totalClasses}</h2>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/admin/kelas" className="flex items-center gap-3 p-4 rounded-xl border border-purple-100 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors font-medium">
            <IconChalkboard />
            <span>Kelola Kelas</span>
          </Link>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed">
            <IconUsers />
            <span>Kelola Pengguna (Segera)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
