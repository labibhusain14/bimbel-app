"use client";

import { useState } from "react";

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (classCode: string) => void;
}

const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const IconKey = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Dummy available classes
const availableClasses = [
  {
    id: "1",
    code: "ABCD123",
    name: "Desain UI/UX Profesional",
    teacher: "Rina Kusumawati",
    students: 42,
  },
  {
    id: "2",
    code: "EFGH456",
    name: "Pemrograman Web Modern",
    teacher: "Budi Santoso",
    students: 38,
  },
  {
    id: "3",
    code: "IJKL789",
    name: "Menulis Kreatif & Copywriting",
    teacher: "Sari Dewi",
    students: 29,
  },
  {
    id: "4",
    code: "MNOP012",
    name: "Bahasa Inggris Intensif",
    teacher: "Ahmad Fauzan",
    students: 55,
  },
  {
    id: "5",
    code: "QRST345",
    name: "Ilustrasi Digital",
    teacher: "Maya Putri",
    students: 31,
  },
];

type JoinMethod = "code" | "search";

export default function JoinClassModal({
  isOpen,
  onClose,
  onJoin,
}: JoinClassModalProps) {
  const [method, setMethod] = useState<JoinMethod>("code");
  const [classCode, setClassCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoinWithCode = async () => {
    if (!classCode.trim()) {
      setError("Silakan masukkan kode kelas");
      return;
    }

    const classExists = availableClasses.some(
      (c) => c.code.toUpperCase() === classCode.toUpperCase()
    );

    if (!classExists) {
      setError("Kode kelas tidak ditemukan");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onJoin(classCode.toUpperCase());
      setClassCode("");
      setError(null);
      onClose();
    } catch (err) {
      setError("Gagal bergabung dengan kelas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinWithClass = async (code: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onJoin(code);
      setSearchQuery("");
      setError(null);
      onClose();
    } catch (err) {
      setError("Gagal bergabung dengan kelas");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClasses = availableClasses.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Gabung Kelas</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Tutup modal"
            >
              <IconX />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Method Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setMethod("code");
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
                  method === "code"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconKey className="w-4 h-4" />
                Kode Kelas
              </button>
              <button
                onClick={() => {
                  setMethod("search");
                  setError(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md font-semibold text-sm transition-all ${
                  method === "search"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconSearch className="w-4 h-4" />
                Cari Kelas
              </button>
            </div>

            {/* Method: Code */}
            {method === "code" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="classCode"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Masukkan Kode Kelas
                  </label>
                  <input
                    id="classCode"
                    type="text"
                    value={classCode}
                    onChange={(e) => {
                      setClassCode(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    placeholder="Contoh: ABCD123"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Minta kode kelas dari guru Anda
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
                    <div className="text-red-600 flex-shrink-0 mt-0.5">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Method: Search */}
            {method === "search" && (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="searchClass"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Cari Kelas
                  </label>
                  <div className="relative">
                    <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="searchClass"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama kelas atau guru..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Class List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => handleJoinWithClass(cls.code)}
                        disabled={isLoading}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                              {cls.name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-1">
                              {cls.teacher}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cls.students} siswa • {cls.code}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <IconPlus className="w-5 h-5 text-purple-600" />
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">
                        Kelas tidak ditemukan
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer - hanya untuk method code */}
          {method === "code" && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleJoinWithCode}
                disabled={isLoading || !classCode.trim()}
                className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Bergabung...
                  </>
                ) : (
                  <>
                    <IconPlus />
                    Bergabung
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
