import { createAdminClient } from "@/utils/supabase/admin";
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/utils/auth/session";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { full_name, email, password, phone } = await request.json();

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Cek apakah email sudah terdaftar
    const { data: existing } = await supabase
      .schema("bimbel")
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Insert user baru dengan role student
    const { data: user, error } = await supabase
      .schema("bimbel")
      .from("users")
      .insert({
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        phone: phone?.trim() || null,
        role: "student",
        is_active: true,
      })
      .select("id, email, full_name, role")
      .single();

    if (error) {
      console.error("Signup DB error:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Gagal membuat akun. Coba lagi.",
          detail: process.env.NODE_ENV === "development" ? error : undefined,
        },
        { status: 500 }
      );
    }

    // Buat session JWT
    const token = await createSession({
      id: user.id,
      email: user.email,
      role: user.role as "admin" | "teacher" | "student",
      full_name: user.full_name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
