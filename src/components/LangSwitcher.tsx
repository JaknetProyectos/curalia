"use client";

import { Loader2, Languages } from "lucide-react";
import { useLocaleContext } from "@/context/LangContext";

export default function LangSwitcher() {
  const { locale, switchLanguage, isPending } = useLocaleContext();

  const nextLang = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() => switchLanguage(nextLang)}
      disabled={isPending}
      aria-label="Cambiar idioma"
      className="
        group
        fixed
        bottom-6
        right-6
        z-30
        flex
        items-center
        gap-2
        rounded-full
        bg-zinc-950/90
        p-2
        pr-4
        text-white
        shadow-xl
        border
        border-zinc-800
        backdrop-blur-md
        transition-all
        duration-300
        hover:border-orange-500/50
        hover:bg-zinc-900
        hover:shadow-orange-500/10
        active:scale-95
        disabled:cursor-not-allowed
        disabled:opacity-80
      "
    >
      {/* Círculo indicador con ícono / estado */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-orange-600">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Languages className="h-4 w-4" />
        )}
      </div>

      {/* Etiqueta de idioma con contraste claro y legibilidad */}
      <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider">
        <span className="text-zinc-400 transition-colors group-hover:text-zinc-200">
          {locale.toUpperCase()}
        </span>
        <span className="text-zinc-600">/</span>
        <span className="text-orange-400 group-hover:text-orange-300">
          {nextLang.toUpperCase()}
        </span>
      </div>
    </button>
  );
}