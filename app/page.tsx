"use client";

import Link from "next/link";
import { useState } from "react";

const programs = [
  {
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Seni & Desain Digital",
    desc: "Pelajari UI/UX, ilustrasi, dan desain grafis dengan perangkat industri terkini.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Pemrograman Kreatif",
    desc: "Bangun website interaktif dan aplikasi inovatif dengan pendekatan kreatif.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Menulis Naratif",
    desc: "Kembangkan gaya penulisan unikmu untuk fiksi, copywriting, atau jurnalistik.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: "Bahasa & Budaya",
    desc: "Kuasai bahasa asing dengan metode imersif yang menghubungkanmu dengan dunia.",
  },
];

const stats = [
  { value: "10,000+", label: "Siswa Aktif" },
  { value: "500+", label: "Tutor Ahli" },
  { value: "4.9 ★", label: "Rating Kepuasan" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Navbar ── */}
      <nav className="bg-white px-5 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">G</div>
          <span className="text-purple-600 font-bold text-base sm:text-lg">ghaitsmartedu</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {["Programs", "Tutors", "Pricing"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-gray-700 hover:text-purple-600 text-sm font-medium transition-colors">Login</Link>
          <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">Sign Up</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-1 rounded" aria-label="Toggle menu">
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-5 py-4 flex flex-col gap-4">
            {["Programs", "Tutors", "Pricing"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-gray-700 hover:text-purple-600 text-sm font-medium" onClick={() => setMenuOpen(false)}>{item}</Link>
            ))}
            <hr className="border-gray-100" />
            <div className="flex gap-3">
              <Link href="/login" className="flex-1 text-center border border-purple-600 text-purple-600 text-sm font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="flex-1 text-center bg-purple-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="bg-gray-50 px-5 py-12 md:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-8">

          {/* Left */}
          <div className="flex-1 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Platform Belajar Generasi Baru
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
              Buka Potensi<br />Kreatifmu Bersama{" "}
              <span className="text-purple-600">Tutor<br />Terbaik</span>
            </h1>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              Pengalaman belajar yang dipersonalisasi untuk siswa modern. Kembangkan bakatmu dalam desain, teknologi, dan seni dengan bimbingan eksklusif.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                Mulai Belajar Sekarang
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/programs" className="border border-gray-300 hover:border-purple-400 text-gray-700 hover:text-purple-600 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200">
                Lihat Program
              </Link>
            </div>
          </div>

          {/* Right — visual cards */}
          <div className="flex-1 w-full max-w-lg grid grid-cols-2 gap-3">
            {/* Main illustration card */}
            <div className="col-span-2 md:col-span-1 row-span-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl overflow-hidden min-h-[220px] flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <svg className="w-40 h-40 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              </div>
              {/* Stylized people illustration */}
              <div className="relative z-10 flex flex-col items-center gap-3 p-6">
                <div className="flex gap-2 items-end">
                  <div className="w-10 h-14 bg-orange-300 rounded-xl flex items-end justify-center pb-1">
                    <div className="w-6 h-6 bg-orange-500 rounded-full" />
                  </div>
                  <div className="w-12 h-16 bg-purple-300 rounded-xl flex items-end justify-center pb-1">
                    <div className="w-7 h-7 bg-purple-600 rounded-full" />
                  </div>
                  <div className="w-10 h-12 bg-blue-200 rounded-xl flex items-end justify-center pb-1">
                    <div className="w-6 h-6 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="w-32 h-2 bg-orange-200 rounded-full" />
                <div className="w-24 h-2 bg-orange-100 rounded-full" />
                <span className="text-orange-700 font-semibold text-xs mt-1">Sesi Belajar Interaktif</span>
              </div>
            </div>

            {/* Creative Tools card */}
            <div className="bg-purple-600 rounded-2xl p-5 flex flex-col items-center justify-center text-white text-center min-h-[120px] gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              <span className="text-sm font-bold">Creative Tools</span>
            </div>

            {/* Tutor card */}
            <div className="bg-gray-900 rounded-2xl p-5 flex flex-col justify-between min-h-[120px]">
              <div className="flex gap-1.5">
                <div className="w-7 h-7 rounded-full bg-purple-400" />
                <div className="w-7 h-7 rounded-full bg-amber-300 -ml-2" />
                <div className="w-7 h-7 rounded-full bg-pink-400 -ml-2" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">500+ Tutor Berpengalaman</p>
                <p className="text-gray-400 text-xs mt-0.5">Siap membimbing Anda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-y border-gray-100 py-8 px-5">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wide font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Programs Section ── */}
      <section className="py-14 px-5 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Program Unggulan Kami</h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-md mx-auto">
              Pilih dari berbagai kelas yang dirancang khusus untuk mengembangkan keterampilan kreatif di era digital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3 border border-gray-100 group">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  {p.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{p.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">{p.desc}</p>
                <Link href="/programs" className="text-purple-600 hover:text-purple-700 text-xs font-semibold flex items-center gap-1 transition-colors">
                  Pelajari Selengkapnya
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-14 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-purple-600 rounded-3xl px-8 py-12 text-center text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-purple-500 opacity-40" />
            <div className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-purple-700 opacity-30" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Start?</h2>
              <p className="text-purple-200 text-sm sm:text-base max-w-sm mx-auto mb-8">
                Bergabunglah dengan ribuan siswa lainnya dan mulai perjalanan kreatifmu hari ini. Pendaftaran gratis!
              </p>
              <Link href="/signup" className="inline-block bg-white text-purple-600 font-bold px-7 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm shadow-lg">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 px-5 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">G</div>
              <span className="text-purple-600 font-bold text-sm">ghaitsmartedu</span>
            </Link>
            <p className="text-xs text-gray-400 mt-1">© 2026 GhaitsmartEdu. Empowering creative minds.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact Us</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-gray-700 transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
