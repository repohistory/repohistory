import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { RevalidateOnFocus } from "@/components/layout/revalidate-on-focus";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <>
      <RevalidateOnFocus />
      <Navbar user={session.user} />
      <div className="w-full">
        {children}
      </div>
    </>
  );
}
