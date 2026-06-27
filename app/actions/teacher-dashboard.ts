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

export async function getTeacherDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user || user.role !== "teacher") return null;

  const supabase = createAdminClient();

  // 1. Fetch classrooms taught by this teacher
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
      status,
      subjects ( name ),
      student_classrooms ( count )
    `)
    .eq("teacher_id", user.id)
    .eq("status", "active");

  if (error) {
    console.error("Fetch teacher dashboard error:", error);
    return null;
  }

  const activeClasses = classrooms || [];
  
  // 2. Format class list
  const courses = activeClasses.map((c: any, index: number) => {
    const style = gradients[index % gradients.length];
    const subjectName = Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name;
    const studentCount = Array.isArray(c.student_classrooms) ? c.student_classrooms[0]?.count : c.student_classrooms?.count;

    return {
      id: c.id,
      title: c.name,
      category: subjectName ?? "Umum",
      scheduleDay: c.schedule_day,
      scheduleTime: c.start_time ? `${c.start_time.substring(0,5)} - ${c.end_time?.substring(0,5)}` : "-",
      lokasi: c.lokasi || "Online",
      gradient: style.gradient,
      accent: style.accent,
      students: studentCount ?? 0,
    };
  });

  // Calculate total students across all active classes
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);

  // 3. Fetch unreviewed assignments
  let unreviewedCount = 0;
  let recentSubmissions: any[] = [];
  
  const classIds = activeClasses.map(c => c.id);
  
  if (classIds.length > 0) {
    // Get meetings for these classes
    const { data: meetings } = await supabase
      .schema("bimbel")
      .from("classroom_meetings")
      .select("id")
      .in("classroom_id", classIds);
      
    const meetingIds = meetings?.map((m: any) => m.id) || [];
    
    if (meetingIds.length > 0) {
      // Get assignments
      const { data: assignments } = await supabase
        .schema("bimbel")
        .from("assignments")
        .select(`
          id, 
          title,
          assignment_submissions (
            id,
            status,
            submitted_at,
            users ( full_name )
          )
        `)
        .in("meeting_id", meetingIds);
        
      if (assignments) {
        // Count unreviewed
        assignments.forEach((a: any) => {
          const subs = Array.isArray(a.assignment_submissions) ? a.assignment_submissions : [];
          const unreviewedSubs = subs.filter((s: any) => s.status === "submitted" || s.status === "late");
          unreviewedCount += unreviewedSubs.length;
          
          // Add to recent submissions
          unreviewedSubs.forEach((s: any) => {
            const studentName = Array.isArray(s.users) ? s.users[0]?.full_name : s.users?.full_name;
            recentSubmissions.push({
              id: s.id,
              assignmentId: a.id,
              assignmentTitle: a.title,
              studentName: studentName || "Siswa",
              submittedAt: s.submitted_at,
              status: s.status
            });
          });
        });
        
        // Sort recent submissions by date (newest first)
        recentSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        recentSubmissions = recentSubmissions.slice(0, 5); // Take top 5
      }
    }
  }

  // 4. Get today's meetings
  const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase(); 
  // Wait, our DB uses "Senin", "Selasa" etc.
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayIndo = days[new Date().getDay()];
  
  const todaysClasses = courses.filter(c => c.scheduleDay === todayIndo);

  return {
    user,
    courses,
    stats: {
      activeClasses: activeClasses.length,
      totalStudents,
      unreviewedCount,
      todaysClassesCount: todaysClasses.length
    },
    recentSubmissions,
    todaysClasses
  };
}
