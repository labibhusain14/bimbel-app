"use server";

import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";

// Karena tabel `announcements` belum ada di skema DB (db.sql),
// untuk saat ini kita mensimulasikan fetch data menggunakan server action.
// Jika tabel sudah dibuat di Supabase, Anda cukup mengubah fungsi ini
// menggunakan supabase.from("announcements").select(...)
export async function getPengumumanData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const user = await verifySession(token);
  if (!user) return null;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const announcements = [
    {
      id: 1,
      title: "Libur Nasional Hari Raya",
      sender: "Admin ghaitsmartedu",
      time: "2 jam lalu",
      content: "Diingatkan kembali bahwa seluruh sesi kelas online dan offline pada tanggal merah minggu depan akan diliburkan. Jadwal pengganti akan diinfokan oleh guru masing-masing.",
      type: "system", // general info
      read: false,
      color: "blue"
    },
    {
      id: 2,
      title: "Tugas Akhir: Desain UI/UX",
      sender: "Rina Kusumawati",
      time: "Kemarin, 14:00",
      content: "Silakan cek halaman tugas. Saya sudah mengunggah kriteria penilaian untuk tugas akhir pembuatan prototype E-Commerce. Mohon dibaca dengan teliti karena bobotnya besar.",
      type: "course",
      course: "Desain UI/UX Profesional",
      read: false,
      color: "violet"
    },
    {
      id: 3,
      title: "Materi React Hooks",
      sender: "Budi Santoso",
      time: "3 hari lalu",
      content: "Slide presentasi dan video rekaman sesi tentang React Hooks & State Management sudah bisa diunduh di dashboard materi. Siapkan pertanyaan untuk sesi Q&A besok ya!",
      type: "course",
      course: "Pemrograman Web Modern",
      read: true,
      color: "teal"
    },
    {
      id: 4,
      title: "Perubahan Jadwal: Bahasa Inggris",
      sender: "Ahmad Fauzan",
      time: "1 minggu lalu",
      content: "Kelas Bahasa Inggris Intensif hari Kamis ini dimajukan menjadi jam 08:00 pagi. Mohon persiapkan diri dan hadir tepat waktu.",
      type: "course",
      course: "Bahasa Inggris Intensif",
      read: true,
      color: "amber"
    }
  ];

  return announcements;
}
