"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";

export interface ScheduleItem {
  id: string;
  classroomId: string;
  startTime: string;   // "08:00"
  endTime: string;     // "09:30"
  course: string;
  subject: string;
  teacher: string;
  type: "Online" | "Offline";
  scheduleDay: string; // "Senin", "Selasa", etc.
  lokasi: string;
}

const DAY_MAP: Record<string, number> = {
  senin: 0, selasa: 1, rabu: 2, kamis: 3,
  jumat: 4, sabtu: 5, minggu: 6,
};

function padTime(t: string | null): string {
  if (!t) return "00:00";
  // t could be "08:00:00" from Postgres TIME type
  return t.slice(0, 5);
}

export async function getJadwalData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  const supabase = createAdminClient();

  // Ambil semua kelas aktif yang diikuti siswa ini (beserta jadwalnya)
  const { data: studentClasses, error } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .select(`
      classroom_id,
      classrooms (
        id,
        name,
        schedule_day,
        start_time,
        end_time,
        lokasi,
        subjects ( name ),
        users ( full_name )
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "active");

  if (error) {
    console.error("Fetch jadwal error:", error);
    return null;
  }

  // Bangun map: dayIndex => ScheduleItem[]
  const scheduleByDay: Record<number, ScheduleItem[]> = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
  };

  studentClasses?.forEach((sc) => {
    const c = sc.classrooms as any;
    if (!c || !c.schedule_day) return;

    const dayKey = (c.schedule_day as string).toLowerCase().trim();
    const dayIdx = DAY_MAP[dayKey];
    if (dayIdx === undefined) return;

    const subjectName = Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name;
    const teacherName = Array.isArray(c.users) ? c.users[0]?.full_name : c.users?.full_name;
    const isOnline = !c.lokasi || c.lokasi.toLowerCase().includes("zoom") || c.lokasi.toLowerCase().includes("online") || c.lokasi.toLowerCase().includes("meet");

    const item: ScheduleItem = {
      id: sc.classroom_id,
      classroomId: c.id,
      startTime: padTime(c.start_time),
      endTime: padTime(c.end_time),
      course: c.name,
      subject: subjectName ?? "Umum",
      teacher: teacherName ?? "Tidak ada guru",
      type: isOnline ? "Online" : "Offline",
      scheduleDay: c.schedule_day,
      lokasi: c.lokasi ?? "",
    };

    scheduleByDay[dayIdx].push(item);
  });

  // Sort each day by start time
  for (const key of Object.keys(scheduleByDay)) {
    scheduleByDay[Number(key)].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const totalSessions = Object.values(scheduleByDay).reduce((acc, arr) => acc + arr.length, 0);

  return { user, scheduleByDay, totalSessions };
}
