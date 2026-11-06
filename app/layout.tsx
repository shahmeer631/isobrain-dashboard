import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/lib/redux/Provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { cookies } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ISOBrain - Learning Dashboard",
  description: "Advanced ISO Learning Management System",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/isobrain-favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
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
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="isobrain-dashboard-theme"
        >
          <StoreProvider token={token}>
            {children}
            <Toaster position="top-right" richColors />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
