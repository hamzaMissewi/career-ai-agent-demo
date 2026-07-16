import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ConvexClientProvider } from "./components/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career AI Agent",
  description:
    "An AI career copilot that searches jobs, matches them to your profile, and chats you through your next move.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <ConvexClientProvider>
          <header className="flex h-16 items-center justify-between border-b border-black/8 px-6 dark:border-white/[.145]">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                Career AI Agent
              </Link>
              <nav className="flex items-center gap-4">
                <Link
                  href="/pricing"
                  className="text-sm text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
                >
                  Pricing
                </Link>
                <Show when="signed-in">
                  <Link
                    href="/chat"
                    className="text-sm text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
                  >
                    Chat
                  </Link>
                </Show>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton>
                  <button className="h-9 rounded-full px-4 text-sm font-medium transition-colors hover:bg-black/4 dark:hover:bg-white/8">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="h-9 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}