"use client";

import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-orange-600 py-12 md:py-20">
      {/* Imagen de fondo con gradiente naranja sofisticado */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1603982222981-20f4389264b7?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt={t("bgAlt")}
          className="h-full w-full object-cover mix-blend-multiply opacity-25"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600/20 to-transparent"
        />
      </div>

      <div className="container-brand relative px-4 md:px-8">
        <div className="flex min-h-[480px] items-center py-6 md:min-h-[540px]">
          <div className="animate-fade-in-up w-full max-w-[580px] rounded-3xl bg-white p-8 shadow-2xl backdrop-blur-md sm:p-10 md:p-12 border border-orange-100">

            <h1 className="heading-title text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl md:text-[42px] leading-[1.15]">
              {t("title")}
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-600">
              {t("description")}
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}