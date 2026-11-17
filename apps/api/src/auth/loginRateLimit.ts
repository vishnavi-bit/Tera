// Failed-login limit: after `maxFailures` failures for one key (the normalised email) within `windowMs`, further attempts are
// refused until the oldest of those failures ages out of the window. A successful login clears the key.
// The counts live in memory, so they reset when the process restarts and are per instance.
export interface LoginLimiterOptions { maxFailures?: number; windowMs?: number; now?: () => number }

export function createLoginLimiter({ maxFailures = 5, windowMs = 15 * 60 * 1000, now = () => Date.now() }: LoginLimiterOptions = {}) {
  const failures = new Map<string, number[]>();

  function recent(key: string): number[] {
    const cutoff = now() - windowMs;
    const list = (failures.get(key) ?? []).filter((t) => t > cutoff);
    if (list.length === 0) failures.delete(key); else failures.set(key, list);
    return list;
  }

  return {
    // Locked when the key already has `maxFailures` failures in the window; retryAfterSeconds says when to try again.
    check(key: string): { locked: boolean; retryAfterSeconds: number } {
      const list = recent(key);
      if (list.length < maxFailures) return { locked: false, retryAfterSeconds: 0 };
      const freesAt = list[list.length - maxFailures] + windowMs;
      return { locked: true, retryAfterSeconds: Math.max(1, Math.ceil((freesAt - now()) / 1000)) };
    },
    fail(key: string): void {
      const list = recent(key);
      failures.set(key, [...list, now()]);
    },
    reset(key: string): void {
      failures.delete(key);
    }
  };
}
