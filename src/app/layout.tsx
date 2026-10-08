import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { EventJsonLd } from "@/components/seo/EventJsonLd";
import { DEFAULT_SETTINGS } from "@/lib/default-settings";

export const metadata: Metadata = {
  title: "IoT Lab CoE & Expothon | Saveetha School of Engineering, SIMATS",
  description: "Official portal of IoT Lab Centre of Excellence, Department of ECE, Saveetha School of Engineering, SIMATS. National-Level Project Exhibition 'Expothon'.",
  keywords: ["IoT Lab CoE", "SIMATS", "Saveetha School of Engineering", "Expothon", "ECE Project Exhibition", "IoT Projects"],
  authors: [{ name: "Department of ECE, SSE, SIMATS" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = DEFAULT_SETTINGS;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <EventJsonLd settings={settings} />
      </head>
      <body
        className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnnouncementBanner announcement={settings.announcement} />
          <Navbar settings={settings} />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  );
}
