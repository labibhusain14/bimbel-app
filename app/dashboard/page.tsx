import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { getDashboardData } from "@/app/actions/dashboard";
import { getTeacherDashboardData } from "@/app/actions/teacher-dashboard";
import { getAdminDashboardData } from "@/app/actions/admin-dashboard";
import StudentDashboardClient from "@/components/StudentDashboardClient";
import TeacherDashboard from "@/components/TeacherDashboard";
import AdminDashboard from "@/components/AdminDashboard";

import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  let user = null;
  
  if (token) {
    user = await verifySession(token);
  }

  if (user?.role === "admin") {
    redirect("/dashboard/admin");
  } else if (user?.role === "teacher") {
    const data = await getTeacherDashboardData();
    return <TeacherDashboard data={data} />;
  } else {
    // Default to student
    const data = await getDashboardData();
    return <StudentDashboardClient initialData={data} />;
  }
}
