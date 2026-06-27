"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";

const gradients = [
  { gradient: "from-violet-500 to-purple-700", accent: "bg-violet-500" },
  { gradient: "from-cyan-500 to-teal-600", accent: "bg-teal-500" },
  { gradient: "from-rose-500 to-pink-600", accent: "bg-rose-500" },
  { gradient: "from-amber-500 to-orange-600", accent: "bg-amber-500" },
  { gradient: "from-indigo-500 to-blue-600", accent: "bg-indigo-500" },
  { gradient: "from-emerald-500 to-green-600", accent: "bg-emerald-500" },
];

const accentColors = [
  { border: "border-violet-400", dot: "bg-violet-500" },
  { border: "border-teal-400", dot: "bg-teal-500" },
  { border: "border-rose-400", dot: "bg-rose-500" },
  { border: "border-amber-400", dot: "bg-amber-500" },
  { border: "border-indigo-400", dot: "bg-indigo-500" },
  { border: "border-emerald-400", dot: "bg-emerald-500" },
];

function timeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export async function getDashboardData() {
  // Next.js 15+: cookies() is now async
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  const supabase = createAdminClient();

  // ── 1. Kelas yang diikuti siswa ──────────────────────────────
  const { data: studentClasses, error } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .select(`
      status,
      classroom_id,
      classrooms (
        id,
        name,
        subjects ( name ),
        users ( full_name )
      )
    `)
    .eq("student_id", user.id);

  if (error) {
    console.error("Fetch dashboard error:", error);
    return null;
  }

  const activeClasses = studentClasses?.filter((c) => c.status === "active") ?? [];
  const completedClasses = studentClasses?.filter((c) => c.status === "completed") ?? [];

  const courses = activeClasses.map((sc, index) => {
    const c = sc.classrooms as any;
    const style = gradients[index % gradients.length];
    const subjectName = Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name;
    const teacherName = Array.isArray(c.users) ? c.users[0]?.full_name : c.users?.full_name;

    return {
      id: c.id,
      title: c.name,
      teacher: teacherName ?? "Tidak ada guru",
      category: subjectName ?? "Umum",
      gradient: style.gradient,
      accent: style.accent,
      initial: teacherName ? (teacherName as string).charAt(0).toUpperCase() : "G",
      students: 0,
    };
  });

  // ── 2. Pengumuman: meeting terbaru dari kelas aktif ──────────
  const activeClassroomIds = activeClasses.map((sc) => sc.classroom_id);
  let announcements: any[] = [];
  let pendingTaskCount = 0;

  if (activeClassroomIds.length > 0) {
    const { data: meetings } = await supabase
      .schema("bimbel")
      .from("classroom_meetings")
      .select(`
        id,
        topic,
        notes,
        meeting_date,
        created_at,
        classrooms (
          name,
          users ( full_name )
        )
      `)
      .in("classroom_id", activeClassroomIds)
      .order("created_at", { ascending: false })
      .limit(5);

      if (meetings) {
        announcements = meetings.map((m: any, index: number) => {
          const color = accentColors[index % accentColors.length];
          const classroom = m.classrooms as any;
          const teacherName = Array.isArray(classroom?.users)
            ? classroom.users[0]?.full_name
            : classroom?.users?.full_name;

          return {
            id: m.id,
            course: classroom?.name ?? "Kelas",
            teacher: teacherName ?? "",
            message: m.topic
              ? `Pertemuan: ${m.topic}${m.notes ? ` — ${m.notes}` : ""}`
              : "Pertemuan baru dijadwalkan.",
            time: timeAgo(m.created_at ?? m.meeting_date),
            accent: color.border,
            dot: color.dot,
          };
        });

        // ── 3. Hitung tugas pending (belum dikumpulkan student) ──
        const meetingIds = meetings.map((m: any) => m.id);
        if (meetingIds.length > 0) {
          const { data: assignments } = await supabase
            .schema("bimbel")
            .from("assignments")
            .select(`id, assignment_submissions ( id, student_id )`)
            .in("meeting_id", meetingIds);

          if (assignments) {
            pendingTaskCount = assignments.filter((a: any) => {
              const subs: any[] = Array.isArray(a.assignment_submissions)
                ? a.assignment_submissions
                : [];
              return !subs.some((s: any) => s.student_id === user.id);
            }).length;
          }
        }
      }
    }

  // ── 4. Jumlah sertifikat siswa ──────────────────────────────
  const { count: certificateCount } = await supabase
    .schema("bimbel")
    .from("certificates")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)
    .eq("status", "issued");

  return {
    user,
    courses,
    announcements,
    pendingTaskCount,
    certificateCount: certificateCount ?? 0,
    stats: {
      active: activeClasses.length,
      completed: completedClasses.length,
    },
  };
}
