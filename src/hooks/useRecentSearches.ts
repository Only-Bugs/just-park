import { useCallback, useMemo, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage";
import type { StoredPlace } from "../types/search";

const KEY = "recent";
const MAX = 5;

export function useRecentSearches() {
  const [items, setItems] = useState<StoredPlace[]>(() =>
    readJSON<StoredPlace[]>(KEY, [])
  );

  const list = useMemo(
    () => [...items].sort((a, b) => b.ts - a.ts).slice(0, MAX),
    [items]
  );

  const add = useCallback((p: Omit<StoredPlace, "ts">) => {
    setItems((prev) => {
      const deDuped = prev.filter(
        (x) => !(x.lat === p.lat && x.lng === p.lng && x.label === p.label)
      );
      const next = [{ ...p, ts: Date.now() }, ...deDuped].slice(0, MAX);
      writeJSON(KEY, next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeJSON(KEY, []);
    setItems([]);
  }, []);

  return { list, add, clear };
}
