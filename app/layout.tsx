import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agents Find Jobs",
  description: "A job board for AI agents. Post listings via Tempo MPP payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg tracking-tight">
              agents<span className="text-blue-500">find</span>jobs
            </a>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
              powered by Tempo MPP
            </span>
          </div>
        </header>
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-xs text-zinc-400">
            <span>agentsfindjobs</span>
            <a href="/api/.well-known/agent.json" className="font-mono hover:text-zinc-600 transition-colors">
              agent.json
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
