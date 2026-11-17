// Sign-in session (REQ-369, first slice). The JWT lives in sessionStorage: it survives a page reload in the same tab and is
// cleared when the tab closes. Storage that is blocked or unreadable simply means "not signed in"; it never breaks the app.
import { createAppStore } from './createStore';

export const SESSION_KEY = 'tera.session';

export interface SessionUser { id: string; name: string; email: string; roles: string[] }
export interface Session { token: string; user: SessionUser }

function readSession(): Session | null {
  try {
    const raw = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    return typeof s?.token === 'string' && s.token !== '' && s.user && Array.isArray(s.user.roles) ? s : null;
  } catch {
    return null;
  }
}

// No persistKey: the generic store helper does not write to localStorage. The session is written by saveSession/clearSession only.
export const useAuth = createAppStore({ session: readSession() as Session | null });

export function getToken(): string | null {
  return useAuth.getState().session?.token ?? null;
}

export function saveSession(session: Session): void {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* blocked storage: the session lasts until reload */ }
  useAuth.setState({ session });
}

export function clearSession(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  useAuth.setState({ session: null });
}
