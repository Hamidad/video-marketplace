import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { i18n, type Locale } from "../../i18n-config";
import { getDictionary } from "../../../get-dictionary";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ToastProvider } from "@/components/ui/toast-context";

import { Header } from "@/components/ui/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Video Marketplace",
  description: "Mobile-first video marketplace",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex justify-center bg-gray-900`}
      >
        <div className="w-full max-w-md h-full min-h-screen relative bg-white dark:bg-black shadow-2xl overflow-hidden">
          <ToastProvider>
            <Header />
            {children}
            <BottomNav lang={lang as Locale} dict={dict} />
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
