import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";
import Link from "next/link";
import { redirect } from "next/navigation";
import TeacherGradingClient from "@/components/TeacherGradingClient";
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

export default async function TeacherGrading() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const user = await verifySession(token);
  if (!user || user.role !== "teacher") redirect("/dashboard");

  const supabase = createAdminClient();

  // 1. Ambil daftar kelas yang diajar guru
  const { data: classrooms } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .select("id, name")
    .eq("teacher_id", user.id);

  const classroomIds = classrooms?.map(c => c.id) || [];
  let allSubmissions: any[] = [];

  if (classroomIds.length > 0) {
    // 2. Ambil semua meeting dari kelas-kelas tersebut
    const { data: meetings } = await supabase
      .schema("bimbel")
      .from("classroom_meetings")
      .select("id, classroom_id")
      .in("classroom_id", classroomIds);

    const meetingIds = meetings?.map(m => m.id) || [];

    if (meetingIds.length > 0) {
      // 3. Ambil semua tugas (assignments)
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

      // Susun data
      if (assignments) {
        assignments.forEach((a: any) => {
          const m = meetings?.find(m => m.id === a.meeting_id);
          const cls = classrooms?.find(c => c.id === m?.classroom_id);
          const subs = Array.isArray(a.assignment_submissions) ? a.assignment_submissions : [];
          
          subs.forEach((s: any) => {
            const studentName = Array.isArray(s.users) ? s.users[0]?.full_name : s.users?.full_name;
            allSubmissions.push({
              id: s.id,
              assignmentId: a.id,
              assignmentTitle: a.title,
              className: cls?.name || "Kelas",
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

  // Sort: status unreviewed (submitted/late) di atas, lalu berdasarkan tanggal kumpul terbaru
  allSubmissions.sort((a, b) => {
    const isAUnreviewed = a.status === "submitted" || a.status === "late";
    const isBUnreviewed = b.status === "submitted" || b.status === "late";
    
    if (isAUnreviewed && !isBUnreviewed) return -1;
    if (!isAUnreviewed && isBUnreviewed) return 1;
    
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <TeacherGradingClient initialSubmissions={allSubmissions} />
    </div>
  );
}
