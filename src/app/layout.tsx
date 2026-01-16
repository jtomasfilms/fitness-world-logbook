import type { Metadata } from "next";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Fitness World Logbook",
  description: "Workout tracking PWA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WorkoutLog",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
