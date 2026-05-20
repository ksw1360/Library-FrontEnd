"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number | null;
  available: boolean;
}

const BASE_URL = "./env.production"; // 배포 환경에서는 .env.production 파일의 값을 사용

export default function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${BASE_URL}/books/${id}`);
        if (res.ok) {
          const data: Book = await res.json();
          setBook(data);
          setTitle(data.title);
          setAuthor(data.author);
          setPrice(data.price != null ? String(data.price) : "");
        } else {
          setBook(null);
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleLoan = async () => {
    if (!book?.available) return;
    try {
      const res = await fetch(`${BASE_URL}/books/${id}/loan`, {
        method: "PATCH",
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBook(updated);
        alert("대출 처리가 완료되었습니다! 📖");
      } else {
        alert("대출 처리 실패!");
      }
    } catch (error) {
      console.error("대출 에러:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까? 🗑️")) return;
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        alert("도서가 삭제되었습니다.");
        router.push("/");
        router.refresh();
      } else {
        alert("삭제 실패!");
      }
    } catch (error) {
      console.error("삭제 에러:", error);
    }
  };

  // 수정 모드 진입/취소
  const handleEdit = () => {
    if (isEditing && book) {
      // 취소 시 원본 값으로 복원
      setTitle(book.title);
      setAuthor(book.author);
      setPrice(book.price != null ? String(book.price) : "");
    }
    setIsEditing(!isEditing);
  };

  // 수정 저장
  const handleUpdate = async () => {
    if (!confirm("수정하시겠습니까?")) return;
    try {
      const res = await fetch(`${BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          price: price === "" ? null : Number(price),
        }),
      });
      if (res.ok) {
        const updated: Book = await res.json();
        setBook(updated);
        setIsEditing(false);
        alert("도서 내용이 수정되었습니다.");
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("수정 에러:", error);
    }
  };

  if (isLoading)
    return (
      <div className="text-center mt-20 text-xl font-bold">로딩 중... ⏳</div>
    );

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          도서를 찾을 수 없습니다 😢
        </h1>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 border border-gray-200 rounded-xl shadow-sm bg-white mt-8">
      <h2 className="text-sm uppercase tracking-widest text-blue-500 font-bold mb-2">
        BOOK ID : {book.id}
      </h2>

      {/* 상태 뱃지 */}
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            book.available
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {book.available ? "✅ 대출 가능" : "📖 대출 중"}
        </span>
      </div>

      <div className="border-b-2 border-gray-100 pb-4 mb-6">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">
          도서명
        </label>
        <input
          type="text"
          value={title}
          readOnly={!isEditing}
          onChange={(e) => setTitle(e.target.value)}
          className={`text-2xl font-extrabold text-gray-900 w-full outline-none p-2 rounded border-2 ${
            isEditing
              ? "bg-white border-blue-300"
              : "bg-gray-50 border-transparent"
          }`}
        />
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            저자
          </label>
          <input
            type="text"
            value={author}
            readOnly={!isEditing}
            onChange={(e) => setAuthor(e.target.value)}
            className={`w-full outline-none border-2 p-3 rounded-lg text-gray-700 ${
              isEditing
                ? "bg-white border-blue-300"
                : "bg-gray-50 border-gray-100"
            }`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            가격
          </label>
          <input
            type={isEditing ? "number" : "text"}
            value={
              isEditing
                ? price
                : price
                  ? Number(price).toLocaleString() + "원"
                  : "-"
            }
            readOnly={!isEditing}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full outline-none border-2 p-3 rounded-lg text-gray-700 ${
              isEditing
                ? "bg-white border-blue-300"
                : "bg-gray-50 border-gray-100"
            }`}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-6">
        <Link
          href="/"
          className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          돌아가기
        </Link>

        <div className="flex gap-3">
          {book.available && !isEditing && (
            <button
              onClick={handleLoan}
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              대출 처리
            </button>
          )}

          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              저장
            </button>
          ) : null}

          <button
            onClick={handleEdit}
            className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isEditing ? "취소" : "수정"}
          </button>

          {!isEditing && (
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 bg-white text-red-600 border border-red-200 font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
