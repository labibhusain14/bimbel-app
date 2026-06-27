import { createAdminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });

  const user = await verifySession(token);
  if (!user) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });

  const body = await request.json();
  const { classroomId } = body;

  if (!classroomId) {
    return NextResponse.json({ error: "classroomId diperlukan" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Cek kelas ada dan aktif
  const { data: classroom, error: classError } = await supabase
    .schema("bimbel")
    .from("classrooms")
    .select("id, name, quota")
    .eq("id", classroomId)
    .eq("status", "active")
    .single();

  if (classError || !classroom) {
    return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
  }

  // Cek sudah bergabung?
  const { data: existing } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .select("id, status")
    .eq("student_id", user.id)
    .eq("classroom_id", classroomId)
    .maybeSingle();

  if (existing) {
    if (existing.status === "active") {
      return NextResponse.json({ error: "Kamu sudah terdaftar di kelas ini" }, { status: 409 });
    }
    // Reaktivasi jika pernah keluar
    await supabase
      .schema("bimbel")
      .from("student_classrooms")
      .update({ status: "active" })
      .eq("id", existing.id);
    return NextResponse.json({ success: true, message: "Berhasil bergabung kembali" });
  }

  // Daftarkan siswa
  const { error: joinError } = await supabase
    .schema("bimbel")
    .from("student_classrooms")
    .insert({
      student_id: user.id,
      classroom_id: classroomId,
      status: "active",
      join_date: new Date().toISOString().split("T")[0],
    });

  if (joinError) {
    console.error("Join error:", joinError);
    return NextResponse.json({ error: "Gagal bergabung" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: `Berhasil bergabung ke ${classroom.name}` });
}
