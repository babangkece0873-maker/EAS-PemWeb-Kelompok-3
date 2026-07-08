import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  console.log("========== APP LAYOUT ==========");
  console.log("SESSION:", session);

  return <AppShell>{children}</AppShell>;
}