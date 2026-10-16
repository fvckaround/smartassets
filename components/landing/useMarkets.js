"use client";

import { useEffect, useState } from "react";

// Fetches the cached market data and refreshes it every 60 seconds.
export default function useMarkets() {
  const [state, setState] = useState({ coins: [], loading: true, error: false, updatedAt: null });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/markets");
        const data = await res.json();
        if (!alive) return;
        if (!res.ok || !data.coins?.length) {
          setState((s) => ({ ...s, loading: false, error: s.coins.length === 0 }));
          return;
        }
        setState({ coins: data.coins, loading: false, error: false, updatedAt: data.updatedAt });
      } catch {
        if (alive) setState((s) => ({ ...s, loading: false, error: s.coins.length === 0 }));
      }
    }

    load();
    const timer = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return state;
}