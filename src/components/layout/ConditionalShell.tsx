"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const FULL_SCREEN_ROUTES = ["/simulate", "/results", "/sign-in", "/sign-up", "/dashboard", "/document-analysis", "/ai-coach", "/ai-tools", "/pricing"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname.startsWith(r));

  if (isFullScreen) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
    </>
  );
}
