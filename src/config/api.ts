// src/config/api.ts
// API 베이스 URL과 엔드포인트를 중앙에서 관리합니다.
// 환경변수는 .env.local (개발) / .env.production (배포) 또는 Amplify 환경변수에서 주입됩니다.

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

if (!BASE_URL && typeof window !== "undefined") {
  // 빌드 시점에 환경변수가 빠졌을 때 빠르게 알아차리기 위한 경고
  console.warn(
    "[config/api] NEXT_PUBLIC_API_BASE_URL 이 정의되지 않았습니다. .env 파일을 확인하세요.",
  );
}

// 도서 관련 엔드포인트
// - 정적 경로는 문자열로
// - 동적 경로는 함수로 받아서 안전하게 조립
export const API_ENDPOINTS = {
  books: {
    list: `${BASE_URL}/books`,
    create: `${BASE_URL}/books`,
    detail: (id: number | string) => `${BASE_URL}/books/${id}`,
    update: (id: number | string) => `${BASE_URL}/books/${id}`,
    delete: (id: number | string) => `${BASE_URL}/books/${id}`,
    loan: (id: number | string) => `${BASE_URL}/books/${id}/loan`,
    return: (id: number | string) => `${BASE_URL}/books/${id}/return`,
  },
} as const;
