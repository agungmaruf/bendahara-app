"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

export function CelebrationToast({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] celebration-toast">
      <div className="flex items-center gap-2 bg-[color:var(--ok)] text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
        <PartyPopper className="w-4 h-4" />
        {message}
      </div>
    </div>
  );
}
