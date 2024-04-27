import { Montserrat } from "next/font/google";
import { Inter } from "next/font/google";


export const inter = Inter({ subsets: ["latin"] });

export const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const fonts = [montserrat.variable];
