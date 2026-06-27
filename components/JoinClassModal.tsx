"use client";

import { useState, useEffect } from "react";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (classCode: string) => void;
}

interface ClassOption {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  quota: number;
  schedule_day: string;
}

type JoinMethod = "code" | "search";

// ── Icons ───────────────────────────────────────────────────────
const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconKey = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const IconBook = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function JoinClassModal({ isOpen, onClose, onJoin }: JoinClassModalProps) {
  const [method, setMethod] = useState<JoinMethod>("code");
  const [classCode, setClassCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [fetchingClasses, setFetchingClasses] = useState(false);

  // Fetch available classes when switching to search tab
  useEffect(() => {
    if (method === "search" && classes.length === 0) {
      setFetchingClasses(true);
      fetch("/api/kelas/search")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setClasses(data);
        })
        .catch(console.error)
        .finally(() => setFetchingClasses(false));
    }
  }, [method]);

  if (!isOpen) return null;

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinWithCode = async () => {
    if (!classCode.trim()) {
      setError("Silakan masukkan kode kelas");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/kelas/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: classCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kode kelas tidak ditemukan");
        return;
      }
      onJoin(classCode.toUpperCase());
      setClassCode("");
      setError(null);
      onClose();
    } catch {
      setError("Gagal bergabung. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWithClass = async (classId: string, className: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kelas/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId: classId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal bergabung");
        return;
      }
      onJoin(className);
      setSearchQuery("");
      setError(null);
      onClose();
    } catch {
      setError("Gagal bergabung. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
          style={{ maxHeight: "85vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Gabung Kelas</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            >
              <IconX />
            </button>
          </div>

          {/* ── Tab Switch ── */}
          <div className="px-6 pt-5 pb-4 shrink-0">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => { setMethod("code"); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                  method === "code" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconKey />
                Kode Kelas
              </button>
              <button
                onClick={() => { setMethod("search"); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                  method === "search" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <IconSearch />
                Cari Kelas
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex-1 overflow-y-auto px-6 pb-2">

            {/* === Kode Kelas === */}
            {method === "code" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="classCode" className="block text-sm font-semibold text-gray-800 mb-2">
                    Masukkan Kode Kelas
                  </label>
                  <input
                    id="classCode"
                    type="text"
                    value={classCode}
                    onChange={(e) => { setClassCode(e.target.value.toUpperCase()); setError(null); }}
                    placeholder="Contoh: ABCD123"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    maxLength={20}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinWithCode()}
                  />
                  <p className="text-xs text-gray-400 mt-2">Minta kode kelas dari guru Anda</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* === Cari Kelas === */}
            {method === "search" && (
              <div className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <IconSearch />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama kelas atau guru..."
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                {/* Class List */}
                {fetchingClasses ? (
                  <div className="flex items-center justify-center py-10 gap-3">
                    <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Memuat daftar kelas...</span>
                  </div>
                ) : filteredClasses.length > 0 ? (
                  <div className="flex flex-col gap-2 pb-2">
                    {filteredClasses.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => handleJoinWithClass(cls.id, cls.name)}
                        disabled={isLoading}
                        className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-50 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-200 transition-colors">
                              <IconBook />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 leading-snug mb-0.5">{cls.name}</p>
                              <p className="text-xs text-gray-500">{cls.teacher}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{cls.subject}</span>
                                {cls.schedule_day && (
                                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{cls.schedule_day}</span>
                                )}
                                <span className="text-[10px] text-gray-400">Kuota {cls.quota}</span>
                              </div>
                            </div>
                          </div>
                          <div className="shrink-0 w-7 h-7 rounded-full bg-purple-100 group-hover:bg-purple-600 flex items-center justify-center transition-colors text-purple-600 group-hover:text-white mt-0.5">
                            <IconPlus />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <IconSearch />
                    </div>
                    <p className="text-sm font-semibold text-gray-500">Kelas tidak ditemukan</p>
                    <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain atau masukkan kode kelas</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {method === "code" && (
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleJoinWithCode}
                disabled={isLoading || !classCode.trim()}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IconPlus />
                )}
                {isLoading ? "Bergabung..." : "Bergabung"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
