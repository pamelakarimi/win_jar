// ALL calls to the backend live in this one file.
import { clearToken, getToken } from './auth';
import { localDateString } from './date';
import type { AuthResponse, Win } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }

  // Token expired or invalid on a protected route -> log out and go to login
  if (res.status === 401 && !path.startsWith('/auth')) {
    clearToken();
    window.location.assign('/login');
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error ?? 'Something went wrong', res.status);
  }
  return data as T;
}

// ---- Auth ----
export const signup = (email: string, password: string) =>
  request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const login = (email: string, password: string) =>
  request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// ---- Wins ----
export const getWins = () => request<Win[]>('/wins');

export const getRandomWin = () => request<Win>('/wins/random');

export const addWin = (text: string, emoji: string | null) =>
  request<Win>('/wins', {
    method: 'POST',
    body: JSON.stringify({ text, emoji, date: localDateString() }),
  });

export const updateWin = (id: number, text: string) =>
  request<Win>(`/wins/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ text }),
  });

export const deleteWin = (id: number) =>
  request<void>(`/wins/${id}`, { method: 'DELETE' });
