import Link from "next/link";
import { getMaterialDetail } from "@/app/actions/kelas";

// ── Icons ───────────────────────────────────────────────────────
const IconChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
  </svg>
);
const IconPlay = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconDocument = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconLink = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const IconDownload = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const IconExternal = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default async function MaterialDetailPage({ params }: { params: Promise<{ id: string; materialId: string }> }) {
  const { id, materialId } = await params;
  const material = await getMaterialDetail(materialId);

  if (!material) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Materi tidak ditemukan.</p>
        <Link href={`/dashboard/kelas/${id}`} className="text-sm text-purple-600 font-semibold mt-4 inline-block">Kembali ke kelas</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link 
            href={`/dashboard/kelas/${id}`} 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm font-semibold transition-colors mb-6 bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg"
          >
            <IconChevronLeft />
            Kembali ke Kelas
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                  material.type === "video" ? "bg-red-100 text-red-700" :
                  material.type === "pdf" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {material.type === "video" ? "Video Pembelajaran" : material.type === "pdf" ? "Dokumen PDF" : "Tautan Eksternal"}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                {material.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Viewer / Preview Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Type-specific visualization */}
              {material.type === "video" && (
                <div className="w-full aspect-video bg-gray-900 relative group flex items-center justify-center cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center relative z-10 shadow-xl shadow-purple-900/50 group-hover:scale-110 transition-transform">
                    <IconPlay />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-1/3" />
                  </div>
                </div>
              )}

              {material.type === "pdf" && (
                <div className="w-full py-20 bg-blue-50/50 border-b border-blue-100 flex flex-col items-center justify-center text-blue-600">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <IconDocument />
                  </div>
                  <h3 className="font-bold text-lg text-blue-900 mb-1">{material.title}</h3>
                  <p className="text-sm font-medium text-blue-600/80">Dokumen PDF • 2.4 MB</p>
                </div>
              )}

              {material.type === "link" && (
                <div className="w-full py-20 bg-green-50/50 border-b border-green-100 flex flex-col items-center justify-center text-green-600">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <IconLink />
                  </div>
                  <h3 className="font-bold text-lg text-green-900 mb-1">{material.title}</h3>
                  <p className="text-sm font-medium text-green-600/80">Tautan Eksternal</p>
                </div>
              )}

              {/* Description Body */}
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi Materi</h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {material.description || "Tidak ada deskripsi."}
                </p>
                
                {/* Action Buttons below description */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                  {material.type === "pdf" && (
                    <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-purple-200">
                      <IconDownload />
                      Unduh Dokumen
                    </button>
                  )}
                  {material.type === "link" && (
                    <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-green-200">
                      <IconExternal />
                      Kunjungi Tautan
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">
                    Tandai Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Informasi Detail</h3>
              
              <ul className="space-y-4">
                <li className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400">TANGGAL DIUNGGAH</span>
                  <span className="text-sm font-medium text-gray-800">{material.date}</span>
                </li>
                
                <li className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400">UKURAN FILE</span>
                  <span className="text-sm font-medium text-gray-800">2.4 MB</span>
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400">TIPE KONTEN</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{material.type}</span>
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-400">STATUS PEMBELAJARAN</span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-sm font-medium text-gray-600">Belum dipelajari</span>
                  </div>
                </li>
              </ul>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
