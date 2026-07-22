"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const MexicoFlag = () => (
  <svg viewBox="0 0 33 24" className="h-4 w-[22px] rounded-[2px]" aria-hidden>
    <rect width="11" height="24" fill="#006847" />
    <rect x="11" width="11" height="24" fill="#fff" />
    <rect x="22" width="11" height="24" fill="#ce1126" />
    <circle cx="16.5" cy="12" r="2.4" fill="none" stroke="#8b5a2b" strokeWidth="0.8" />
  </svg>
);

const UsFlag = () => (
  <svg viewBox="0 0 33 24" className="h-4 w-[22px] rounded-[2px]" aria-hidden>
    <rect width="33" height="24" fill="#b22234" />
    <g fill="#fff">
      {[3, 7, 11, 15, 19].map((y) => (
        <rect key={y} y={y} width="33" height="2" />
      ))}
    </g>
    <rect width="14" height="13" fill="#3c3b6e" />
  </svg>
);

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="relative">
        {open && (
          <div className="absolute bottom-full right-0 mb-2 w-36 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
            <button
              type="button"
              onClick={() => {
                setLang("en");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--ink))] hover:bg-secondary"
            >
              <UsFlag /> English
            </button>
            <button
              type="button"
              onClick={() => {
                setLang("es");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--ink))] hover:bg-secondary"
            >
              <MexicoFlag /> Spanish
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 shadow-lg"
        >
          {lang === "es" ? <MexicoFlag /> : <UsFlag />}
          <span className="text-sm font-semibold text-[hsl(var(--ink))]">
            {lang === "es" ? "ES" : "EN"}
          </span>
          <ChevronUp
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </div>
    </div>
  );
}
