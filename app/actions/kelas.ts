"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getClassDetail(classId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  const supabase = createAdminClient();

  // 1. Get classroom details
  const { data: cls } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .select(`
      id,
      name,
      join_code,
      schedule_day,
      start_time,
      end_time,
      lokasi,
      subjects ( name, description ),
      users ( full_name ),
      student_classrooms ( count ),
      classroom_meetings (
        id,
        materials ( id, title, created_at, file_url ),
        assignments (
          id, title, deadline,
          assignment_submissions ( student_id, score, status )
        )
      )
    `)
    .eq("id", classId)
    .single();

  if (!cls) return null;

  const teacherName = Array.isArray(cls.users) ? (cls.users[0] as any)?.full_name : (cls.users as any)?.full_name || "Tidak ada guru";
  const subjectName = Array.isArray(cls.subjects) ? (cls.subjects[0] as any)?.name : (cls.subjects as any)?.name || "Umum";
  const description = Array.isArray(cls.subjects) ? (cls.subjects[0] as any)?.description : (cls.subjects as any)?.description || "Deskripsi kelas ini belum tersedia.";
  const studentCount = cls.student_classrooms && Array.isArray(cls.student_classrooms) ? (cls.student_classrooms[0] as any)?.count || 0 : 0;

  // 2. Map Materials and Tasks
  const materials: any[] = [];
  const tasks: any[] = [];
  let materialCount = 0;
  let taskCount = 0;

  if (cls.classroom_meetings) {
    const meetings = Array.isArray(cls.classroom_meetings) ? cls.classroom_meetings : [cls.classroom_meetings];
    meetings.forEach((m: any) => {
      // Materials
      if (m.materials) {
        const mats = Array.isArray(m.materials) ? m.materials : [m.materials];
        mats.forEach((mat: any) => {
          materialCount++;
          materials.push({
            id: mat.id,
            title: mat.title,
            type: mat.file_url && mat.file_url.includes(".mp4") ? "video" : "pdf", // basic heuristic
            date: new Date(mat.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
            size: "2.4 MB" // Dummy size as we don't store it yet
          });
        });
      }

      // Assignments
      if (m.assignments) {
        const assigns = Array.isArray(m.assignments) ? m.assignments : [m.assignments];
        assigns.forEach((a: any) => {
          taskCount++;
          
          let status = "pending";
          let score = null;
          
          if (a.assignment_submissions) {
            const subs = Array.isArray(a.assignment_submissions) ? a.assignment_submissions : [a.assignment_submissions];
            const mySub = subs.find((s: any) => s.student_id === user.id);
            if (mySub) {
              status = mySub.score != null ? "graded" : "submitted";
              score = mySub.score;
            }
          }

          if (status === "pending" && a.deadline && new Date(a.deadline) < new Date()) {
            status = "late";
          }

          tasks.push({
            id: a.id,
            title: a.title,
            deadline: a.deadline ? new Date(a.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Tidak ada tenggat",
            status,
            score
          });
        });
      }
    });
  }

  // 3. Get Members
  const { data: membersData } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .select(`
      users ( id, full_name, role )
    `)
    .eq("classroom_id", classId)
    .eq("status", "active");

  const members = (membersData || []).map((m: any) => {
    const u = Array.isArray(m.users) ? m.users[0] : m.users;
    return {
      id: u?.id,
      name: u?.full_name,
      role: u?.role
    };
  });
  
  // Add Teacher
  if (cls.users) {
     const t = Array.isArray(cls.users) ? cls.users[0] : cls.users;
     // Prepend teacher
     members.unshift({
        id: "teacher-" + classId,
        name: t?.full_name,
        role: "teacher"
     });
  }

  const scheduleList = [];
  if (cls.schedule_day) {
    scheduleList.push({
      day: cls.schedule_day,
      time: `${(cls.start_time || "").substring(0,5)} - ${(cls.end_time || "").substring(0,5)}`,
      lokasi: cls.lokasi || "Online"
    });
  }

  return {
    id: cls.id,
    name: cls.name,
    joinCode: cls.join_code,
    category: subjectName,
    instructor: teacherName,
    description,
    students: studentCount || members.length - 1, // fallback to members length minus teacher
    materials: materialCount,
    tasks: taskCount,
    schedule: scheduleList,
    coverColor: "from-blue-600 via-indigo-600 to-purple-600",
    
    // Lists for tabs
    materialsList: materials,
    tasksList: tasks,
    membersList: members
  };
}

export async function getMaterialDetail(materialId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .schema("bimbel")
    .from("materials")
    .select(`
      id, title, description, file_url, created_at,
      classroom_meetings (
        classrooms ( id, name )
      )
    `)
    .eq("id", materialId)
    .single();

  if (!data) return null;

  let className = "Kelas";
  let classId = "";
  if (data.classroom_meetings) {
    const cls = Array.isArray((data.classroom_meetings as any).classrooms) 
      ? (data.classroom_meetings as any).classrooms[0] 
      : (data.classroom_meetings as any).classrooms;
    className = cls?.name || "Kelas";
    classId = cls?.id || "";
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    file_url: data.file_url,
    class_name: className,
    class_id: classId,
    type: data.file_url && data.file_url.includes(".mp4") ? "video" : "pdf",
    date: new Date(data.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
  };
}

export async function getClassSubmissions(classId: string) {
  const supabase = createAdminClient();
  
  // 1. Dapatkan daftar meeting dari kelas ini
  const { data: meetings } = await supabase
    .schema("bimbel")
    .from("classroom_meetings")
    .select("id, classrooms(name)")
    .eq("classroom_id", classId);

  const meetingIds = meetings?.map((m: any) => m.id) || [];
  let allSubmissions: any[] = [];

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

  // Sort by status (unreviewed first), then by date
  allSubmissions.sort((a, b) => {
    const isAUnreviewed = a.status === "submitted" || a.status === "late";
    const isBUnreviewed = b.status === "submitted" || b.status === "late";
    
    if (isAUnreviewed && !isBUnreviewed) return -1;
    if (!isAUnreviewed && isBUnreviewed) return 1;
    
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  return allSubmissions;
}

export async function gradeSubmission(submissionId: string, score: number) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .schema("bimbel")
    .from("assignment_submissions")
    .update({ 
      score: score,
      status: "graded",
      updated_at: new Date().toISOString()
    })
    .eq("id", submissionId);
    
  if (error) {
    console.error("Error grading submission:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
