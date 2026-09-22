import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/lib/redux/Provider";
import { Toaster } from "sonner";
import "./globals.css";

import { cookies } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ISOBrain - Learning Dashboard",
  description: "Advanced ISO Learning Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const tokenVal = cookieStore.get("accessToken")?.value;
  const token = tokenVal && tokenVal.trim() !== "" ? tokenVal : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <StoreProvider token={token}>
          {children}
          <Toaster position="top-right" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
