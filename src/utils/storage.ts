const NS = "justpark";
function key(k: string) {
  return `${NS}:${k}`;
}

export function readJSON<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(k));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(k: string, value: T): void {
  try {
    localStorage.setItem(key(k), JSON.stringify(value));
  } catch {
    /* ignore quota/SSR errors */
  }
}
