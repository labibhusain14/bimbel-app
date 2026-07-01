"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function getAllClasses() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
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
      subjects ( id, name ),
      users!fk_classroom_teacher ( id, full_name ),
      student_classrooms ( count )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all classes:", error);
    return [];
  }

  return data || [];
}

export async function createClass(classData: any) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .insert([
      {
        name: classData.name,
        subject_id: classData.subject_id,
        teacher_id: classData.teacher_id,
        schedule_day: classData.schedule_day,
        start_time: classData.start_time,
        end_time: classData.end_time,
        lokasi: classData.lokasi,
        join_code: classData.join_code,
        status: "active"
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating class:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getOptionsForClassForm() {
  const supabase = createAdminClient();
  
  const [subjectsRes, teachersRes] = await Promise.all([
    supabase.schema("bimbel").from("subjects").select("id, name"),
    supabase.schema("bimbel").from("users").select("id, full_name").eq("role", "teacher")
  ]);

  return {
    subjects: subjectsRes.data || [],
    teachers: teachersRes.data || []
  };
}
