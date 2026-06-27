"use client";

import Link from "next/link";
import { Material, getMaterialsByClass } from "./materialData";

const IconPlay = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const IconDocument = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconLink = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function ClassMaterialTab({ classId }: { classId: string }) {
  // load materials for this class (fallback to "1")
  const materials: Material[] = getMaterialsByClass(classId ?? "1");
  const getIcon = (type: Material["type"]) => {
    switch (type) {
      case "video":
        return <IconPlay className="text-red-600" />;
      case "document":
        return <IconDocument className="text-blue-600" />;
      case "link":
        return <IconLink className="text-green-600" />;
    }
  };

  const getTypeLabel = (type: Material["type"]) => {
    const labels = {
      video: "Video",
      document: "Dokumen",
      link: "Link",
    };
    return labels[type];
  };

  return (
    <div>
      {/* Add Material Button */}
      <div className="mb-6">
        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
          <IconPlus />
          Tambah Materi
        </button>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                {getIcon(material.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {material.title}
                  </h3>
                  <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
                    {getTypeLabel(material.type)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {material.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {material.uploadedAt}
                    {material.size && ` • ${material.size}`}
                  </div>
                  <Link href={`/dashboard/kelas/${classId}/materi/${material.id}`} className="text-sm font-semibold text-purple-600 hover:text-purple-700">
                    Buka
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {materials.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <IconDocument className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-1">Belum ada materi</p>
          <p className="text-sm text-gray-500">Guru akan menambahkan materi pembelajaran di sini</p>
        </div>
      )}
    </div>
  );
}
