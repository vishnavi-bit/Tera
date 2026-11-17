// The one fetch helper for the API. It adds the signed-in user's bearer token to every call. The tenant is never sent from the
// browser: the API takes it from the token. A 401 on a call that carried a token means the session has ended, so the session is
// cleared and the route guard sends the user to the sign-in page.
import { clearSession, getToken } from '../state/authStore';

export async function apiFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = { ...((init.headers as Record<string, string>) ?? {}) };
  const token = getToken();
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401 && token) clearSession();
  return res;
}
