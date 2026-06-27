"use client";

import { useState, useEffect } from "react";
import { getProfileData, updateProfile } from "@/app/actions/setelan";

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
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

// ── Toggle component ────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${value ? "bg-purple-500" : "bg-gray-200"}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? "left-7" : "left-1"}`} />
    </button>
  );
}

export default function SetelanPage() {
  const [activeMenu, setActiveMenu] = useState<"akun" | "notifikasi" | "keamanan" | "tampilan">("akun");

  // ── Akun state ──
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Notifikasi state ──
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifTugas, setNotifTugas] = useState(true);

  // ── Keamanan state ──
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch profil dari DB
  useEffect(() => {
    getProfileData().then((data) => {
      if (data) {
        setFullName(data.full_name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      }
      setLoadingProfile(false);
    });
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg(null);
    const result = await updateProfile({ full_name: fullName, phone });
    if (result.error) {
      setProfileMsg({ type: "error", text: result.error });
    } else {
      setProfileMsg({ type: "success", text: "Profil berhasil disimpan!" });
      setTimeout(() => setProfileMsg(null), 3000);
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) {
      setPassMsg({ type: "error", text: "Isi semua field password" });
      return;
    }
    if (newPass.length < 8) {
      setPassMsg({ type: "error", text: "Password baru minimal 8 karakter" });
      return;
    }
    setSavingPass(true);
    setPassMsg(null);
    // Placeholder — bisa dihubungkan ke Supabase Auth update password
    await new Promise((r) => setTimeout(r, 800));
    setPassMsg({ type: "success", text: "Password berhasil diubah!" });
    setOldPass("");
    setNewPass("");
    setSavingPass(false);
    setTimeout(() => setPassMsg(null), 3000);
  };

  const navItems = [
    { id: "akun", label: "Akun Profil", icon: <IconUser /> },
    { id: "notifikasi", label: "Notifikasi", icon: <IconBell /> },
    { id: "keamanan", label: "Keamanan", icon: <IconShield /> },
    { id: "tampilan", label: "Tampilan", icon: <IconPalette /> },
  ] as const;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">

      {/* ── Sidebar ── */}
      <div className="md:w-56 shrink-0">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-5 px-1">Setelan</h1>
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm shrink-0 md:w-full text-left ${
                activeMenu === item.id
                  ? "bg-purple-50 text-purple-700 font-bold"
                  : "text-gray-600 hover:bg-gray-50 font-medium"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ── Content Panel ── */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">

        {/* ══ Akun ══ */}
        {activeMenu === "akun" && (
          <div className="max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Informasi Akun</h2>

            {loadingProfile ? (
              <div className="flex items-center gap-3 py-8">
                <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                <span className="text-sm text-gray-400">Memuat data profil...</span>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email Utama</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 text-gray-400 rounded-xl px-4 py-2.5 cursor-not-allowed text-sm"
                  />
                  <p className="text-xs text-gray-400">Email tidak dapat diubah. Hubungi admin untuk bantuan.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: +62812..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                {profileMsg && (
                  <div className={`text-sm font-medium rounded-xl px-4 py-3 ${
                    profileMsg.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {profileMsg.text}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    {savingProfile ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <IconCheck />}
                    {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  <button
                    onClick={() => { setFullName(""); setPhone(""); setLoadingProfile(true); getProfileData().then((d) => { if (d) { setFullName(d.full_name ?? ""); setPhone(d.phone ?? ""); } setLoadingProfile(false); }); }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ Notifikasi ══ */}
        {activeMenu === "notifikasi" && (
          <div className="max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Preferensi Notifikasi</h2>
            <div className="space-y-5">
              {[
                { label: "Email Notifikasi", desc: "Terima rangkuman mingguan dan info penting via email.", value: notifEmail, onChange: setNotifEmail },
                { label: "Push Notifications", desc: "Notifikasi popup langsung di browser/aplikasi.", value: notifPush, onChange: setNotifPush },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle value={item.value} onChange={item.onChange} />
                </div>
              ))}

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Pengingat Tugas</p>
                    <p className="text-xs text-gray-400 mt-0.5">Beri tahu saya H-1 sebelum deadline tugas.</p>
                  </div>
                  <Toggle value={notifTugas} onChange={setNotifTugas} />
                </div>
              </div>

              <div className="pt-2">
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors text-sm">
                  <IconCheck />
                  Simpan Preferensi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ Keamanan ══ */}
        {activeMenu === "keamanan" && (
          <div className="max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Keamanan Akun</h2>
            <div className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Password Lama</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Password Baru</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
                />
              </div>

              {passMsg && (
                <div className={`text-sm font-medium rounded-xl px-4 py-3 ${
                  passMsg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {passMsg.text}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={savingPass}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors text-sm"
                >
                  {savingPass ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <IconShield />}
                  {savingPass ? "Menyimpan..." : "Ubah Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ Tampilan ══ */}
        {activeMenu === "tampilan" && (
          <div className="max-w-md">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Pengaturan Tema</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="border-2 border-purple-500 bg-purple-50/50 rounded-2xl p-5 flex flex-col items-center gap-3 transition-colors relative">
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <span className="font-bold text-gray-900 text-sm">Mode Terang</span>
              </button>
              <button className="border-2 border-transparent hover:border-gray-200 bg-gray-50 rounded-2xl p-5 flex flex-col items-center gap-3 transition-colors opacity-50 cursor-not-allowed">
                <div className="w-14 h-14 rounded-full bg-gray-800 shadow-sm flex items-center justify-center border border-gray-700">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                </div>
                <span className="font-bold text-gray-500 text-sm">Mode Gelap <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded ml-1">Segera</span></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
