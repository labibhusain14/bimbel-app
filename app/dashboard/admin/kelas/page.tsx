import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { getAllClasses, getOptionsForClassForm } from "@/app/actions/admin-kelas";
import AdminClassList from "@/components/AdminClassList";

export default async function AdminKelasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/login");

  const user = await verifySession(token);
  if (!user || user.role !== "admin") redirect("/dashboard");

  const [classes, options] = await Promise.all([
    getAllClasses(),
    getOptionsForClassForm()
  ]);

  return <AdminClassList initialClasses={classes} options={options} />;
}
