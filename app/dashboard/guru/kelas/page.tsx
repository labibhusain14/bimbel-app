import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";

// ── SVG Icons ──
const IconUsers = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354c3.866 0 7 1.79 7 4.024 0 2.235-3.134 4.025-7 4.025s-7-1.79-7-4.025c0-2.234 3.134-4.024 7-4.024zm0 10.978c-3.866 0-7 1.79-7 4.025 0 2.234 3.134 4.023 7 4.023s7-1.79 7-4.023c0-2.235-3.134-4.025-7-4.025zm0 4.646c-1.657 0-3.5.898-3.5 2.012 0 1.114 1.843 2.012 3.5 2.012s3.5-.898 3.5-2.012c0-1.114-1.843-2.012-3.5-2.012z" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const gradients = [
  "from-violet-500 to-purple-700",
  "from-cyan-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-indigo-500 to-blue-600",
  "from-emerald-500 to-green-600",
];

export default async function TeacherClassList() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const user = await verifySession(token);
  if (!user || user.role !== "teacher") redirect("/dashboard");

  const supabase = createAdminClient();

  const { data: classrooms, error } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .select(`
      id,
      name,
      schedule_day,
      start_time,
      end_time,
      lokasi,
      join_code,
      status,
      subjects ( name ),
      student_classrooms ( count )
    `)
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const activeClasses = classrooms?.filter(c => c.status === "active") || [];
  const pastClasses = classrooms?.filter(c => c.status !== "active") || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelas Saya</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola kelas, materi, dan tugas untuk siswa Anda.</p>
        </div>
      </div>

      {/* ── Active Classes ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Kelas Aktif ({activeClasses.length})
        </h2>
        
        {activeClasses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeClasses.map((c: any, index: number) => {
              const subjectName = Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name;
              const studentCount = Array.isArray(c.student_classrooms) ? c.student_classrooms[0]?.count : c.student_classrooms?.count;
              const gradient = gradients[index % gradients.length];
              
              return (
                <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col h-full">
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradient}`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${gradient} text-white`}>
                      {subjectName || "Umum"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <IconUsers /> {studentCount || 0}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight group-hover:text-purple-600 transition-colors">{c.name}</h3>
                  {c.join_code && (
                    <div className="text-xs text-gray-500 mb-2 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100 w-fit">
                      Code: <span className="font-mono font-bold text-gray-700 tracking-wider">{c.join_code}</span>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                      <IconCalendar />
                      <span>{c.schedule_day || "-"} <span className="mx-1">•</span> {c.start_time ? c.start_time.substring(0,5) : ""} - {c.end_time ? c.end_time.substring(0,5) : ""}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/guru/kelas/${c.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Kelola kelas</span>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-gray-500">Anda belum memiliki kelas aktif.</p>
          </div>
        )}
      </div>

      {/* ── Past Classes ── */}
      {pastClasses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> Kelas Selesai ({pastClasses.length})
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastClasses.map((c: any) => {
              const subjectName = Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name;
              
              return (
                <div key={c.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative overflow-hidden flex flex-col opacity-75 grayscale hover:grayscale-0 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600">
                      {subjectName || "Umum"}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-700 text-lg mb-1 leading-tight">{c.name}</h3>
                  
                  <Link href={`/dashboard/guru/kelas/${c.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Lihat riwayat kelas</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
