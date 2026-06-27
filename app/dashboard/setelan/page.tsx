"use client";

import { useState } from "react";

// ── Icons ───────────────────────────────────────────────────────
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconBell = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const IconShield = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconPalette = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

export default function SetelanPage() {
  const [activeMenu, setActiveMenu] = useState<"akun" | "notifikasi" | "keamanan" | "tampilan">("akun");
  
  // Dummy Form States
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifTugas, setNotifTugas] = useState(true);
  
  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* ── Sidebar Setelan ── */}
      <div className="md:w-64 shrink-0">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 px-1">Setelan</h1>
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button onClick={() => setActiveMenu("akun")} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors shrink-0 md:shrink ${activeMenu === "akun" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}>
            <IconUser /> <span className="text-sm">Akun Profil</span>
          </button>
          <button onClick={() => setActiveMenu("notifikasi")} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors shrink-0 md:shrink ${activeMenu === "notifikasi" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}>
            <IconBell /> <span className="text-sm">Notifikasi</span>
          </button>
          <button onClick={() => setActiveMenu("keamanan")} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors shrink-0 md:shrink ${activeMenu === "keamanan" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}>
            <IconShield /> <span className="text-sm">Keamanan</span>
          </button>
          <button onClick={() => setActiveMenu("tampilan")} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors shrink-0 md:shrink ${activeMenu === "tampilan" ? "bg-purple-50 text-purple-700 font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}>
            <IconPalette /> <span className="text-sm">Tampilan</span>
          </button>
        </nav>
      </div>

      {/* ── Konten Setelan ── */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        
        {/* Akun */}
        {activeMenu === "akun" && (
          <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Informasi Akun</h2>
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input type="text" defaultValue="Mohammad Labib" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Email Utama</label>
                <input type="email" defaultValue="labib@example.com" disabled className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-2.5 cursor-not-allowed" />
                <p className="text-xs text-gray-400">Email tidak dapat diubah. Hubungi admin untuk bantuan.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Nomor Telepon</label>
                <input type="tel" defaultValue="+62 812 3456 7890" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all" />
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors">Simpan Perubahan</button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors">Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* Notifikasi */}
        {activeMenu === "notifikasi" && (
          <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Preferensi Notifikasi</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Email Notifikasi</p>
                  <p className="text-xs text-gray-500 mt-0.5">Terima rangkuman mingguan dan info penting via email.</p>
                </div>
                <button onClick={() => setNotifEmail(!notifEmail)} className={`relative w-12 h-6 rounded-full transition-colors ${notifEmail ? "bg-purple-500" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifEmail ? "left-7" : "left-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Push Notifications</p>
                  <p className="text-xs text-gray-500 mt-0.5">Notifikasi popup langsung di browser/aplikasi.</p>
                </div>
                <button onClick={() => setNotifPush(!notifPush)} className={`relative w-12 h-6 rounded-full transition-colors ${notifPush ? "bg-purple-500" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifPush ? "left-7" : "left-1"}`} />
                </button>
              </div>
              
              <div className="border-t border-gray-100 my-4 pt-4" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Pengingat Tugas</p>
                  <p className="text-xs text-gray-500 mt-0.5">Beri tahu saya H-1 sebelum deadline tugas.</p>
                </div>
                <button onClick={() => setNotifTugas(!notifTugas)} className={`relative w-12 h-6 rounded-full transition-colors ${notifTugas ? "bg-purple-500" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifTugas ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keamanan */}
        {activeMenu === "keamanan" && (
          <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Keamanan Akun</h2>
            
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Password Lama</label>
                <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Password Baru</label>
                <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white" />
              </div>
              
              <div className="pt-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors">Ubah Password</button>
              </div>
            </div>
          </div>
        )}

        {/* Tampilan */}
        {activeMenu === "tampilan" && (
          <div className="max-w-xl animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Pengaturan Tema</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="border-2 border-purple-500 bg-purple-50/50 rounded-2xl p-4 flex flex-col items-center gap-3 transition-colors relative">
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <span className="font-bold text-gray-900">Mode Terang</span>
              </button>

              <button className="border-2 border-transparent hover:border-gray-200 bg-gray-50 rounded-2xl p-4 flex flex-col items-center gap-3 transition-colors opacity-50 cursor-not-allowed">
                <div className="w-16 h-16 rounded-full bg-gray-800 shadow-sm flex items-center justify-center border border-gray-700">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </div>
                <span className="font-bold text-gray-500">Mode Gelap <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded ml-1">Segera</span></span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
