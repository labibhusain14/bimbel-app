"use client";

import { useState, useRef } from "react";

interface SubmitTaskModalProps {
  isOpen: boolean;
  task?: {
    id: number;
    title: string;
    course: string;
    deadline: string;
  };
  onClose: () => void;
  onSubmit: (data: SubmissionData) => void;
}

export interface SubmissionData {
  taskId: number;
  file?: File;
  notes: string;
}

const IconX = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconUpload = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const IconFile = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function SubmitTaskModal({ isOpen, task, onClose, onSubmit }: SubmitTaskModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !task) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError("Ukuran file tidak boleh lebih dari 10MB");
        setSelectedFile(null);
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setUploadError("Tipe file tidak didukung. Gunakan PDF, Word, Excel, atau gambar.");
        setSelectedFile(null);
        return;
      }

      setUploadError(null);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !notes.trim()) {
      setUploadError("Silakan upload file atau tambahkan catatan");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        taskId: task.id,
        file: selectedFile || undefined,
        notes: notes.trim(),
      });
      
      // Reset form
      setSelectedFile(null);
      setNotes("");
      setUploadError(null);
    } catch (error) {
      setUploadError("Gagal mengirim tugas. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Kumpulkan Tugas</h2>
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
            {/* Task Info */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">
                Tugas
              </p>
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {task.title}
              </h3>
              <p className="text-xs text-gray-600 mb-2">
                {task.course}
              </p>
              <p className="text-xs font-semibold text-gray-500">
                Batas waktu: {task.deadline}
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload File
              </label>
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gray-50 hover:bg-purple-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      <IconFile />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs text-purple-600 hover:text-purple-700 font-semibold mt-2"
                    >
                      Ganti File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <IconUpload />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      Pilih file atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, Word, Excel, atau gambar (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan atau penjelasan tentang tugas mu..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {notes.length}/500 karakter
              </p>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
                <div className="text-red-600 flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-800">
                  {uploadError}
                </p>
              </div>
            )}

            {/* Success Message */}
            {selectedFile && !uploadError && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-3">
                <div className="text-green-600 flex-shrink-0">
                  <IconCheckCircle />
                </div>
                <p className="text-sm font-medium text-green-800">
                  File siap untuk dikirim
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!selectedFile && !notes.trim())}
              className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <IconUpload />
                  Kumpulkan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
