import Link from "next/link";
import { getMaterialById } from "@/components/ClassTabs/materialData";

export default async function MaterialDetailPage({ params }: { params: Promise<{ id: string; materialId: string }> }) {
  const { id, materialId } = await params;
  const material = getMaterialById(Number(materialId));

  if (!material) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Materi tidak ditemukan.</p>
        <div className="mt-3 text-xs text-gray-400">
          <div>Debug: params.id = <span className="font-medium text-gray-600">{id}</span></div>
          <div>Debug: params.materialId = <span className="font-medium text-gray-600">{materialId}</span></div>
        </div>
        <Link href={`/dashboard/kelas/${id}`} className="text-sm text-purple-600 font-semibold mt-4 inline-block">Kembali ke kelas</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-4 flex items-center gap-3">
          <Link href={`/dashboard/kelas/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700">← Kembali</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{material.title}</h1>
              <p className="text-sm text-gray-600 mb-4">{material.description}</p>

              {/* Type-specific preview */}
              {material.type === "video" && (
                <div className="w-full bg-black/5 rounded-lg aspect-video flex items-center justify-center text-gray-400">
                  Video placeholder — embed player here
                </div>
              )}

              {material.type === "document" && (
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-semibold">DOC/PDF</div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md">Unduh</button>
                </div>
              )}

              {material.type === "link" && (
                <div className="flex items-center gap-3">
                  <a href="#" className="text-purple-600 font-semibold">Buka sumber eksternal</a>
                </div>
              )}
            </div>

            <div className="w-48 shrink-0">
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <p className="font-semibold">Info</p>
                <p className="mt-2">Diunggah: {material.uploadedAt}</p>
                {material.size && <p>Ukuran: {material.size}</p>}
                <p className="mt-3"><Link href="#" className="text-purple-600 font-semibold">Laporkan</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
