import { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "도서관 관리 시스템",
  description: "Next.js + Spring Boot 도서관 관리",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <header className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <Link href="/" className="text-xl font-bold">
            📚 도서관 관리 시스템
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline text-gray-600">
              도서 목록
            </Link>
            <Link
              href="/books/add"
              className="px-4 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition-colors text-sm"
            >
              도서 등록
            </Link>
          </nav>
        </header>
        <main className="max-w-screen-md mx-auto py-8 px-4">{children}</main>
        <footer className="py-8 border-t text-center text-gray-500">
          <p>© 2026 도서관 관리 시스템 - Spring Boot + H2 DB 연동</p>
        </footer>
      </body>
    </html>
  );
}
