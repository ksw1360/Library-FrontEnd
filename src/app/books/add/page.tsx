"use client";

import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddBook() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim()) {
      alert("도서명과 저자는 필수 입력 항목입니다!");
      return;
    }

    const bookData = {
      title,
      author,
      price: price ? Number(price) : null,
      available: true,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(API_ENDPOINTS.books.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (res.ok) {
        alert("도서가 등록되었습니다! 📚");
        router.push("/");
        router.refresh();
      } else {
        alert("등록 실패! 서버 상태를 확인해주세요.");
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert("서버 연결 상태를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 border border-gray-200 rounded-xl shadow-sm bg-white mt-8">
      <h2 className="text-sm uppercase tracking-widest text-blue-500 font-bold mb-2">
        NEW BOOK
      </h2>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6 border-b-2 border-gray-100 pb-4">
        도서 등록
      </h1>

      <div className="flex flex-col gap-5">
        {/* 도서명 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            도서명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="도서명을 입력하세요"
            className="border-2 border-gray-100 focus:border-blue-500 outline-none rounded-lg p-3 text-gray-800 bg-gray-50 transition-colors"
          />
        </div>

        {/* 저자 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            저자 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="저자명을 입력하세요"
            className="border-2 border-gray-100 focus:border-blue-500 outline-none rounded-lg p-3 text-gray-800 bg-gray-50 transition-colors"
          />
        </div>

        {/* 가격 */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">
            가격 (선택)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="예: 18000"
            className="border-2 border-gray-100 focus:border-blue-500 outline-none rounded-lg p-3 text-gray-800 bg-gray-50 transition-colors"
          />
        </div>

        {/* 대출 상태 안내 */}
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <span>✅</span>
          <span>
            등록 시 기본적으로 <strong>대출 가능</strong> 상태로 설정됩니다.
          </span>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-6">
        <Link
          href="/"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          돌아가기
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "등록 중..." : "등록 완료"}
        </button>
      </div>
    </div>
  );
}
