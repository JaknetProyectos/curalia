"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBanner() {
  const t = useTranslations("ctaBanner");

  return (
    <section className="relative overflow-hidden bg-orange-500 py-16 md:py-24">
      {/* Elemento decorativo de fondo */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-400/30 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-orange-600/30 blur-3xl pointer-events-none" />

      <div className="container-brand relative px-4 text-center text-white md:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-orange-400/40 bg-orange-600/30 p-8 backdrop-blur-md sm:p-12 md:p-16 shadow-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-orange-200" />
            <span>{t("badge")}</span>
          </div>

          <h2 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl md:text-[38px] leading-tight">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-orange-50 sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-white hover:text-zinc-900 active:scale-95"
            >
              <span>{t("buttonText")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}