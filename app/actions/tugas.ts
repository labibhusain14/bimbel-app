"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";

export type TaskStatus = "pending" | "late" | "submitted" | "graded";

export interface TaskItem {
  id: string;
  assignmentId: string;
  title: string;
  description: string;
  course: string;
  subject: string;
  deadline: string;         // formatted label
  deadlineDate: string;     // ISO string for sorting
  status: TaskStatus;
  score?: number;
  feedback?: string;
  attachmentUrl?: string;
  accent: string;
}

const ACCENTS = ["violet", "teal", "rose", "amber", "indigo", "emerald"];

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Tidak ada tenggat";
  const d = new Date(deadline);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "Kemarin";
    if (absDays === 1) return "Kemarin";
    return `${absDays} hari lalu`;
  }
  if (diffH < 24) return `Hari ini, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays === 1) return `Besok, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  return `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
}

export async function getTugasData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  const supabase = createAdminClient();

  // ── 1. Ambil semua kelas aktif siswa ─────────────────────────
  const { data: studentClasses } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .select("classroom_id")
    .eq("student_id", user.id)
    .eq("status", "active");

  if (!studentClasses || studentClasses.length === 0) {
    return { user, tasks: [] };
  }

  const classroomIds = studentClasses.map((sc) => sc.classroom_id);

  // ── 2. Ambil semua meetings dari kelas aktif ──────────────────
  const { data: meetings } = await supabase
    .schema("bimbel")
    .from("classroom_meetings")
    .select("id, classroom_id")
    .in("classroom_id", classroomIds);

  if (!meetings || meetings.length === 0) {
    return { user, tasks: [] };
  }

  const meetingIds = meetings.map((m) => m.id);

  // Map: meetingId -> classroomId
  const meetingClassMap: Record<string, string> = {};
  meetings.forEach((m) => { meetingClassMap[m.id] = m.classroom_id; });

  // ── 3. Ambil semua assignments dari meetings ──────────────────
  const { data: assignments } = await supabase
    .schema("bimbel")
    .from("assignments")
    .select(`
      id,
      title,
      description,
      deadline,
      attachment_url,
      meeting_id,
      classrooms:classroom_meetings!inner (
        classroom_id,
        classrooms (
          name,
          subjects ( name )
        )
      ),
      assignment_submissions (
        id,
        student_id,
        status,
        score,
        feedback,
        submitted_at
      )
    `)
    .in("meeting_id", meetingIds);

  if (!assignments) return { user, tasks: [] };

  // ── 4. Build TaskItem list ────────────────────────────────────
  const tasks: TaskItem[] = assignments.map((a: any, index: number) => {
    const classroom = a.classrooms?.classrooms as any;
    const courseName = classroom?.name ?? "Kelas";
    const subjectName = Array.isArray(classroom?.subjects)
      ? classroom.subjects[0]?.name
      : classroom?.subjects?.name ?? "Umum";

    // Find submission by this student
    const subs: any[] = Array.isArray(a.assignment_submissions)
      ? a.assignment_submissions
      : [];
    const mySub = subs.find((s) => s.student_id === user.id);

    const now = new Date();
    const deadlineDate = a.deadline ? new Date(a.deadline) : null;

    let status: TaskStatus = "pending";
    if (mySub) {
      status = mySub.score != null ? "graded" : "submitted";
    } else if (deadlineDate && deadlineDate < now) {
      status = "late";
    }

    return {
      id: a.id,
      assignmentId: a.id,
      title: a.title,
      description: a.description ?? "",
      course: courseName,
      subject: subjectName,
      deadline: formatDeadline(a.deadline),
      deadlineDate: a.deadline ?? new Date(0).toISOString(),
      status,
      score: mySub?.score ?? undefined,
      feedback: mySub?.feedback ?? undefined,
      attachmentUrl: a.attachment_url ?? undefined,
      accent: ACCENTS[index % ACCENTS.length],
    };
  });

  return { user, tasks };
}

export async function submitTugas(assignmentId: string, answerText: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return { error: "Tidak terautentikasi" };

  const user = await verifySession(token);
  if (!user) return { error: "Sesi tidak valid" };

  const supabase = createAdminClient();

  const { error } = await supabase
    .schema("bimbel")
    .from("assignment_submissions")
    .upsert({
      assignment_id: assignmentId,
      student_id: user.id,
      answer_text: answerText,
      submitted_at: new Date().toISOString(),
      status: "submitted",
    }, {
      onConflict: "assignment_id,student_id",
    });

  if (error) {
    console.error("Submit tugas error:", error);
    return { error: "Gagal mengumpulkan tugas" };
  }

  return { success: true };
}
