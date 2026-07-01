"use client";

import { useState, useEffect } from "react";
import { getClassSubmissions, gradeSubmission } from "@/app/actions/kelas";

const IconTime = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function GradingTab({ classId }: { classId: string }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [score, setScore] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const fetchSubmissions = async () => {
    setLoading(true);
    const data = await getClassSubmissions(classId);
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [classId]);

  const openGradingModal = (sub: any) => {
    setSelectedSub(sub);
    setScore(sub.score !== null ? sub.score.toString() : "");
    setGradingModalOpen(true);
  };

  const handleGrade = async () => {
    if (!selectedSub || !score) return;
    setSaving(true);
    const res = await gradeSubmission(selectedSub.id, parseInt(score, 10));
    if (res.success) {
      await fetchSubmissions();
      setGradingModalOpen(false);
    } else {
      alert("Gagal menyimpan nilai.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Memuat data penilaian...
      </div>
    );
  }

  const unreviewedCount = submissions.filter(s => s.status === "submitted" || s.status === "late").length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Daftar Pengumpulan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ada <span className="font-bold text-purple-600">{unreviewedCount}</span> tugas yang perlu dinilai di kelas ini.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Siswa</th>
                  <th className="px-6 py-4">Tugas</th>
                  <th className="px-6 py-4">Waktu Kumpul</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Nilai</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s: any) => {
                  const isUnreviewed = s.status === "submitted" || s.status === "late";
                  
                  return (
                    <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${isUnreviewed ? "bg-purple-50/30" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {s.studentName.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-gray-800">{s.studentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800">{s.assignmentTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <IconTime />
                          {new Date(s.submittedAt).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isUnreviewed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Perlu Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                            Selesai
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {s.score !== null ? (
                          <span className="text-sm font-bold text-gray-800">{s.score}/100</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isUnreviewed ? (
                          <button 
                            onClick={() => openGradingModal(s)}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm"
                          >
                            Beri Nilai
                          </button>
                        ) : (
                          <button 
                            onClick={() => openGradingModal(s)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors shadow-sm"
                          >
                            Edit Nilai
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            Belum ada pengumpulan tugas dari siswa.
          </div>
        )}
      </div>

      {gradingModalOpen && selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Penilaian Tugas</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedSub.assignmentTitle}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Siswa</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-medium border border-gray-100">
                  {selectedSub.studentName}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nilai (0 - 100)</label>
                <input 
                  type="number"
                  min="0" max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Masukkan nilai"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all font-semibold"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setGradingModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                disabled={saving}
              >
                Batal
              </button>
              <button 
                onClick={handleGrade}
                className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                disabled={saving || !score}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Nilai"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
