import { createContext, useCallback, useContext, useRef, useState, useEffect } from "react";

type Toast = { id: number; kind?: "info" | "success" | "error"; text: string; ttl?: number };
const Ctx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const id = useRef(1);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const toast: Toast = { id: id.current++, ttl: 3500, kind: "info", ...t };
    setItems((xs) => [toast, ...xs]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== toast.id)), toast.ttl);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="min-w-[240px] rounded-lg border px-3 py-2 text-sm backdrop-blur"
            style={{
              borderColor:
                t.kind === "error"
                  ? "rgba(239,68,68,0.4)"
                  : t.kind === "success"
                  ? "rgba(16,185,129,0.4)"
                  : "var(--stroke-high)",
              background:
                t.kind === "error"
                  ? "rgba(239,68,68,0.1)"
                  : t.kind === "success"
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(255,255,255,0.06)",
              color:
                t.kind === "error"
                  ? "#fecaca"
                  : t.kind === "success"
                  ? "#bbf7d0"
                  : "var(--text-high)",
            }}
            role="status"
            aria-live="polite"
          >
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx.push;
}

