"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getProfilData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  const supabase = createAdminClient();

  // 1. Get user and student_profile
  const { data: userData } = await supabase
    .schema("bimbel")
    .from("users")
    .select(`
      full_name, email, phone, created_at, role,
      student_profiles ( school_name, grade )
    `)
    .eq("id", user.id)
    .single();

  if (!userData) return null;

  const profile = Array.isArray(userData.student_profiles)
    ? userData.student_profiles[0]
    : userData.student_profiles;

  // 2. Get active classes count
  const { count: activeClassesCount } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)
    .eq("status", "active");

  // 3. Get assignment submissions for stats
  const { data: submissions } = await supabase
    .schema("bimbel")
    .from("assignment_submissions")
    .select("score, status")
    .eq("student_id", user.id);

  let tasksCompleted = 0;
  let totalScore = 0;
  let gradedCount = 0;

  if (submissions) {
    submissions.forEach((s) => {
      if (s.status === "submitted" || s.status === "graded" || s.status === "reviewed") {
        tasksCompleted++;
      }
      if (s.score != null) {
        totalScore += Number(s.score);
        gradedCount++;
      }
    });
  }

  const averageScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0;

  // 4. Get certificates
  const { data: certs } = await supabase
    .schema("bimbel")
    .from("certificates")
    .select(`
      id,
      issue_date,
      certificate_number,
      classrooms ( name )
    `)
    .eq("student_id", user.id)
    .eq("status", "issued");

  const certificates = (certs || []).map((c: any, i) => {
    const classObj = Array.isArray(c.classrooms) ? c.classrooms[0] : c.classrooms;
    
    // Format Date
    let dateStr = "";
    if (c.issue_date) {
      dateStr = new Date(c.issue_date).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
      });
    }

    return {
      id: c.id,
      title: classObj?.name || "Sertifikat",
      date: dateStr,
      score: "Lulus", // We could fetch final score from assessments if we wanted
      color: i % 2 === 0 ? "from-violet-500 to-purple-700" : "from-cyan-500 to-teal-600"
    };
  });

  // Calculate join date
  const joinDate = userData.created_at ? new Date(userData.created_at) : new Date();
  const joinDateStr = joinDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" });

  return {
    full_name: userData.full_name,
    email: userData.email,
    phone: userData.phone || "Belum diisi",
    join_date: joinDateStr,
    role: userData.role,
    school_name: profile?.school_name || "Belum diisi",
    grade: profile?.grade || "Belum diisi",
    stats: {
      activeClasses: activeClassesCount || 0,
      tasksCompleted,
      averageScore,
      totalHours: (activeClassesCount || 0) * 2 // Dummy estimation for hours
    },
    certificates
  };
}
