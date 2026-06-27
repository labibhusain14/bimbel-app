import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .select(`
      id,
      name,
      quota,
      schedule_day,
      subjects ( name ),
      users ( full_name )
    `)
    .eq("status", "active")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = (data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    teacher: Array.isArray(c.users) ? c.users[0]?.full_name : c.users?.full_name ?? "Tidak ada guru",
    subject: Array.isArray(c.subjects) ? c.subjects[0]?.name : c.subjects?.name ?? "Umum",
    quota: c.quota ?? 20,
    schedule_day: c.schedule_day ?? "",
  }));

  // Filter if q provided
  const filtered = q
    ? result.filter((c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.teacher.toLowerCase().includes(q.toLowerCase()) ||
        c.subject.toLowerCase().includes(q.toLowerCase())
      )
    : result;

  return NextResponse.json(filtered);
}
