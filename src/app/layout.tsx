import { fonts, montserrat } from "@/assets/fonts";
import "@/app/globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Toaster richColors duration={2000} />
      <body
        className={`${montserrat.className} flex min-h-screen flex-auto flex-shrink-0 flex-col text-black bg-background antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
