import DashboardLayoutClient from "./DashboardLayoutClient";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/utils/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  let user = null;
  
  if (token) {
    user = await verifySession(token);
  }

  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}
