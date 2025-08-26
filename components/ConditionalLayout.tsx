"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (isMainPage) {
    // Main page only: include header and footer
    return (
      <>
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  // All other routes (admin, auth, other pages): no header/footer, just content
  return <>{children}</>;
}
