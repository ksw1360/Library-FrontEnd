// src/lib/api.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// 자주 쓰는 엔드포인트 미리 정의해두면 편함
export const API_ENDPOINTS = {
  books: `${BASE_URL}/books`,
  users: `${BASE_URL}/users`,
  login: `${BASE_URL}/auth/login`,
} as const;
