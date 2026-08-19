"use client";

import { useEffect, useState } from "react";

const COLORS = ["var(--teal)", "var(--gold)", "var(--coral)", "var(--ok)"];

type Piece = { id: number; left: number; color: string; delay: number; duration: number };

/**
 * Ledakan confetti ringan tanpa dependency tambahan.
 * Naikkan `triggerKey` (mis. dengan setState counter) tiap kali ingin memicu ledakan baru.
 */
export function Confetti({ triggerKey }: { triggerKey: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!triggerKey) return;
    const next: Piece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.3,
      duration: 1.2 + Math.random() * 0.6,
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 2200);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
