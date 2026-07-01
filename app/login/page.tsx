"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      // Redirect berdasarkan role
      const role = data.user?.role;
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "teacher") router.push("/dashboard");
      else router.push("/dashboard");
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* ── Navbar ── */}
      <nav className="bg-white px-5 py-3 flex items-center justify-between shadow-sm relative z-50">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">G</div>
          <span className="text-purple-600 font-bold text-base sm:text-lg">ghaitsmartedu</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {["Programs", "Tutors", "Pricing"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors">{item}</Link>
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

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">

          {/* Left — Form */}
          <div className="flex-1 px-6 py-8 sm:px-8 sm:py-10 md:px-12 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Selamat Datang Kembali</h1>
            <p className="text-gray-500 text-sm mb-7">Silakan masuk untuk melanjutkan belajar</p>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email / Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email atau Nomor Handphone</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@email.com atau 0812..."
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Kata Sandi</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Anda"
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    required
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-0.5">
                  <Link href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors">Lupa kata sandi?</Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400 font-medium">atau</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Google Login */}
            <button type="button" className="w-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 text-sm" disabled={loading}>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Masuk dengan Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{" "}
              <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">Daftar sekarang</Link>
            </p>
          </div>

          {/* Right — Purple Banner */}
          <div className="hidden md:flex w-[44%] bg-purple-600 flex-col items-center justify-center p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-500 opacity-40" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-purple-700 opacity-30" />
            <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 lg:p-8 text-center text-white max-w-xs shadow-xl">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 lg:w-14 lg:h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C2.4 20.45 4.05 20 5.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.65 0 .75-.8.75-.85V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                </svg>
              </div>
              <h2 className="text-xl lg:text-2xl font-extrabold leading-snug mb-3">Empowering Creative<br />Minds.</h2>
              <p className="text-xs lg:text-sm text-white/80 leading-relaxed">Bergabunglah dengan komunitas pembelajaran modern kami. Temukan tutor terbaik untuk mengembangkan potensi Anda.</p>
            </div>
          </div>

          {/* Mobile banner */}
          <div className="md:hidden bg-purple-600 px-6 py-8 flex flex-col items-center text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-500 opacity-40" />
            <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-purple-700 opacity-30" />
            <div className="relative z-10 bg-white/10 border border-white/20 rounded-xl p-5 max-w-sm">
              <svg className="w-10 h-10 text-white mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .65.73.45.75.45C2.4 20.45 4.05 20 5.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.65 0 .75-.8.75-.85V6c-.6-.45-1.25-.75-2-1zM21 18.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
              </svg>
              <h2 className="text-lg font-extrabold mb-2">Empowering Creative Minds.</h2>
              <p className="text-xs text-white/80 leading-relaxed">Bergabunglah dengan komunitas pembelajaran modern kami.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-5 py-4 sm:py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">G</div>
            <span className="text-purple-600 font-bold text-sm sm:text-base">ghaitsmartedu</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-500">
            <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact Us</Link>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-gray-700 transition-colors">FAQ</Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">© 2026 GhaitsmaratEdu.</p>
        </div>
      </footer>
    </div>
  );
}
