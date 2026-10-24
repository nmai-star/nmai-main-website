import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "./components/AuthGuard";
import GlobalClickSound from "./components/GlobalClickSound";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NMAI - Learn Skills. Build Your Future.",
  description: "Practical learning for the AI-powered world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let theme = 'dark';
              try {
                const saved = localStorage.getItem('nmai-theme');
                if (['dark', 'light', 'ocean', 'forest', 'rose', 'monochrome'].includes(saved)) theme = saved;
              } catch {}
              document.documentElement.dataset.theme = theme;
              document.documentElement.classList.add(theme === 'light' || theme === 'monochrome' ? 'light' : 'dark');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <GlobalClickSound />
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
