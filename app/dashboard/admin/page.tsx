import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { getAdminDashboardData } from "@/app/actions/admin-dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const user = await verifySession(token);
  if (!user || user.role !== "admin") redirect("/dashboard");

  const data = await getAdminDashboardData();
  return <AdminDashboard data={data} />;
}
