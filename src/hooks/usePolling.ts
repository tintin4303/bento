"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Polls a JSON API endpoint on a fixed interval.
 * Returns the latest data. On each successful fetch, only fields
 * that actually changed will trigger a re-render.
 *
 * @param url         API route to fetch
 * @param initialData Initial value (from server-side props) shown immediately
 * @param intervalMs  Poll interval in milliseconds (default 3 s)
 */
export function usePolling<T>(
  url: string,
  initialData: T,
  intervalMs = 3000
): T {
  const [data, setData] = useState<T>(initialData);
  // Keep a stable ref for the latest data to do a shallow diff before setState
  const latestRef = useRef<string>(JSON.stringify(initialData));

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      const serialized = JSON.stringify(json);
      // Only call setState if something actually changed
      if (serialized !== latestRef.current) {
        latestRef.current = serialized;
        setData(json);
      }
    } catch {
      // Network error — silently keep stale data
    }
  }, [url]);

  useEffect(() => {
    const id = setInterval(fetchData, intervalMs);
    return () => clearInterval(id);
  }, [fetchData, intervalMs]);

  return data;
}
