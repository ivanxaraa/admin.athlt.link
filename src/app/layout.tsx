import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body
        className={`${montserrat.className} flex min-h-screen flex-auto flex-shrink-0 flex-col text-black bg-background antialiased`}
      >
        <Toaster richColors duration={2000} />
        <DashboardNavbar />
        <div className="ml-56">
          <div className=" p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
