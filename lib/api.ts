// Central API Client for OmniSocial AI
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://omnisocialbackend.onrender.com/api'
    : 'http://localhost:5000/api');

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('omni_token');
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('omni_token', token);
  }
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('omni_token');
    localStorage.removeItem('omni_user');
    localStorage.removeItem('omni_tenant');
  }
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('omni_user');
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('omni_user', JSON.stringify(user));
  }
}

export function getStoredTenant(): any | null {
  if (typeof window === 'undefined') return null;
  const tenant = localStorage.getItem('omni_tenant');
  return tenant ? JSON.parse(tenant) : null;
}

export function setStoredTenant(tenant: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('omni_tenant', JSON.stringify(tenant));
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

