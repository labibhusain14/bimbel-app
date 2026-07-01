"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function getAdminDashboardData() {
  const supabase = createAdminClient();

  // Fetch counts in parallel
  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalClasses }
  ] = await Promise.all([
    supabase.schema("bimbel").from("users").select("*", { count: 'exact', head: true }).eq("role", "student"),
    supabase.schema("bimbel").from("users").select("*", { count: 'exact', head: true }).eq("role", "teacher"),
    supabase.schema("bimbel").from("classrooms").select("*", { count: 'exact', head: true })
  ]);

  return {
    totalStudents: totalStudents || 0,
    totalTeachers: totalTeachers || 0,
    totalClasses: totalClasses || 0,
  };
}
