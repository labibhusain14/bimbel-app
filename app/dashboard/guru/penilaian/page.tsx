import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconTime = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default async function TeacherPenilaian() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const user = await verifySession(token);
  if (!user || user.role !== "teacher") redirect("/dashboard");

  const supabase = createAdminClient();

  // Ambil kelas yang diajar
  const { data: classrooms } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .select("id")
    .eq("teacher_id", user.id);

  const classIds = classrooms?.map((c) => c.id) || [];
  
  let allSubmissions: any[] = [];

  if (classIds.length > 0) {
    const { data: meetings } = await supabase
      .schema("bimbel")
      .from("classroom_meetings")
      .select("id, classrooms(name)")
      .in("classroom_id", classIds);

    const meetingIds = meetings?.map((m: any) => m.id) || [];

    if (meetingIds.length > 0) {
      const { data: assignments } = await supabase
        .schema("bimbel")
        .from("assignments")
        .select(`
          id, 
          title,
          meeting_id,
          assignment_submissions (
            id,
            status,
            submitted_at,
            score,
            users ( full_name )
          )
        `)
        .in("meeting_id", meetingIds);

      if (assignments) {
        assignments.forEach((a: any) => {
          const m = meetings?.find((m: any) => m.id === a.meeting_id);
          const subs = Array.isArray(a.assignment_submissions) ? a.assignment_submissions : [];
          
          subs.forEach((s: any) => {
            const studentName = Array.isArray(s.users) ? s.users[0]?.full_name : s.users?.full_name;
            const className = Array.isArray(m?.classrooms) ? (m?.classrooms as any)[0]?.name : (m?.classrooms as any)?.name;
            
            allSubmissions.push({
              id: s.id,
              assignmentId: a.id,
              assignmentTitle: a.title,
              className: className || "Kelas",
              studentName: studentName || "Siswa",
              submittedAt: s.submitted_at,
              status: s.status,
              score: s.score
            });
          });
        });
      }
    }
  }

  // Sort by status (unreviewed first), then by date
  allSubmissions.sort((a, b) => {
    const isAUnreviewed = a.status === "submitted" || a.status === "late";
    const isBUnreviewed = b.status === "submitted" || b.status === "late";
    
    if (isAUnreviewed && !isBUnreviewed) return -1;
    if (!isAUnreviewed && isBUnreviewed) return 1;
    
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  const unreviewedCount = allSubmissions.filter(s => s.status === "submitted" || s.status === "late").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Penilaian Tugas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Anda memiliki <span className="font-bold text-purple-600">{unreviewedCount}</span> tugas yang perlu dinilai.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {allSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Siswa</th>
                  <th className="px-6 py-4">Tugas & Kelas</th>
                  <th className="px-6 py-4">Waktu Kumpul</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Nilai</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allSubmissions.map((s: any) => {
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
                        <p className="text-xs text-gray-500">{s.className}</p>
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
                          <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors shadow-sm">
                            Beri Nilai
                          </button>
                        ) : (
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors shadow-sm">
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
            Belum ada pengumpulan tugas.
          </div>
        )}
      </div>
    </div>
  );
}
