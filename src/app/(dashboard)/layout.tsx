import type { Metadata } from "next";
import { fonts, montserrat } from "@/assets/fonts";
import DashboardNavbar from "@/components/layout/dashboard-navbar";
import { Toaster, toast } from "sonner";
import { env } from "@/utils/constants";

export const metadata: Metadata = {
  title: "ATHLT",
  description: "Admin dashboard",
  openGraph: {
    images:
      "https://vkgipqsozevltuwoxkfe.supabase.co/storage/v1/object/public/athlink/athlink_rounded.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <DashboardNavbar />
      <div className="ml-56">
        <div className=" p-8">{children}</div>
      </div>
    </main>
  );
}
