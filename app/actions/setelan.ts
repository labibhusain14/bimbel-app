"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getProfileData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .schema("bimbel")
    .from("users")
    .select("full_name, email, phone")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getProfileData error:", error);
    return null;
  }

  return {
    full_name: data?.full_name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
  };
}

export async function updateProfile({
  full_name,
  phone,
}: {
  full_name: string;
  phone: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return { error: "Tidak terautentikasi" };

  const user = await verifySession(token);
  if (!user) return { error: "Sesi tidak valid" };

  if (!full_name.trim()) return { error: "Nama tidak boleh kosong" };

  const supabase = createAdminClient();

  const { error } = await supabase
    .schema("bimbel")
    .from("users")
    .update({ full_name: full_name.trim(), phone: phone.trim() })
    .eq("id", user.id);

  if (error) {
    console.error("updateProfile error:", error);
    return { error: "Gagal menyimpan perubahan" };
  }

  return { success: true };
}
