"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number | null;
  available: boolean;
}

//const BASE_URL = "http://library-backend-env.eba-2pqx7bjy.ap-northeast-2.elasticbeanstalk.com";
const BASE_URL = "https://api.ksw1360.asia";

export default function Home() {
  const [bookList, setBookList] = useState<Book[]>([]);
  const [filteredList, setFilteredList] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/books`);
      const data = await res.json();
      setBookList(data || []);
      setFilteredList(data || []);
    } catch (error) {
      console.error("서버 통신 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredList(bookList);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredList(
      bookList.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower),
      ),
    );
  };

  const handleLoan = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/books/${id}/loan`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchBooks();
        alert("대출 처리가 완료되었습니다! 📚");
      } else {
        alert("대출 처리 실패!");
      }
    } catch (error) {
      console.error("대출 에러:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        fetchBooks();
        alert("도서가 삭제되었습니다.");
      } else {
        alert("삭제 실패!");
      }
    } catch (error) {
      console.error("삭제 에러:", error);
    }
  };

  // 반납
  const handleReturn = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/books/${id}/return`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchBooks();
        alert("반납 처리가 완료되었습니다! 📖");
      } else {
        alert("반납 처리 실패!");
      }
    } catch (error) {
      console.error("반납 에러:", error);
    }
  };

  const availCount = bookList.filter((b) => b.available).length;
  const loanCount = bookList.length - availCount;

  if (isLoading)
    return (
      <div className="text-center mt-20 text-xl font-bold">로딩 중... ⏳</div>
    );

  return (
    <div className="mt-8">
      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4 text-center bg-gray-50">
          <p className="text-sm text-gray-500">전체 도서</p>
          <p className="text-2xl font-bold text-gray-800">{bookList.length}</p>
        </div>
        <div className="border rounded-lg p-4 text-center bg-green-50">
          <p className="text-sm text-gray-500">대출 가능</p>
          <p className="text-2xl font-bold text-green-600">{availCount}</p>
        </div>
        <div className="border rounded-lg p-4 text-center bg-orange-50">
          <p className="text-sm text-gray-500">대출 중</p>
          <p className="text-2xl font-bold text-orange-500">{loanCount}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">📋 도서 목록</h2>

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            <th className="p-3 text-gray-600 font-semibold">No</th>
            <th className="p-3 text-gray-600 font-semibold">도서명</th>
            <th className="p-3 text-gray-600 font-semibold">저자</th>
            <th className="p-3 text-gray-600 font-semibold">가격</th>
            <th className="p-3 text-gray-600 font-semibold">상태</th>
            <th className="p-3 text-gray-600 font-semibold">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-400">
                {bookList.length === 0
                  ? "등록된 도서가 없습니다."
                  : "검색 결과가 없습니다."}
              </td>
            </tr>
          ) : (
            filteredList.map((book) => (
              <tr
                key={book.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 text-gray-800">{book.id}</td>
                <td className="p-3 text-gray-800 font-medium">
                  <Link
                    href={`/books/${book.id}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {book.title}
                  </Link>
                </td>
                <td className="p-3 text-gray-600">{book.author}</td>
                <td className="p-3 text-gray-600">
                  {book.price != null
                    ? book.price.toLocaleString() + "원"
                    : "-"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      book.available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {book.available ? "대출 가능" : "대출 중"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {book.available ? (
                      <button
                        onClick={() => handleLoan(book.id)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold rounded hover:bg-blue-100 transition-colors"
                      >
                        대출
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReturn(book.id)}
                        className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-xs font-semibold rounded hover:bg-green-100 transition-colors"
                      >
                        반납
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="px-3 py-1 bg-white text-red-500 border border-red-200 text-xs font-semibold rounded hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2">
        <input
          type="text"
          placeholder="제목 또는 저자 검색..."
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="px-5 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 font-semibold rounded hover:bg-blue-100 transition-colors"
          onClick={handleSearch}
        >
          검색
        </button>
        <button className="px-5 py-2.5 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition-colors">
          <Link href="/books/add">등록</Link>
        </button>
      </div>
    </div>
  );
}
