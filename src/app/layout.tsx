import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConditionalShell } from "@/components/layout/ConditionalShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "BeyonAi | AI Sales Training Simulator",
  description: "Practice high-stakes sales conversations with a realistic AI buyer. Get scored on confidence, persuasion, and objection handling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
        <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-[#8b5a2b]/30 selection:text-orange-200">
          <ConditionalShell>{children}</ConditionalShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
