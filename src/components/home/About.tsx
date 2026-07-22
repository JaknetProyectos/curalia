"use client";

import { useTranslations } from "next-intl";
import { getOptimizedUrl } from "@/lib/images";
import { ShieldCheck, Target, Eye, Sparkles } from "lucide-react";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="acerca" className="bg-white py-12 md:py-16">
      <div className="container-brand px-4 md:px-8">
        {/* Intro dos columnas */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 mb-3 border border-orange-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("intro.badge")}</span>
            </div>
            <h2 className="heading-title text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-[34px] leading-tight">
              {t("intro.title")}
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-zinc-600">
            <p>{t("intro.p1")}</p>
            <p>{t("intro.p2")}</p>
          </div>
        </div>

        {/* Banner de imagen amplio con bordes redondeados */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-100 shadow-md transition-transform duration-300 hover:scale-[1.005]">
          <img
            src={getOptimizedUrl(
              "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            )}
            alt={t("intro.imgAlt")}
            className="h-[260px] w-full object-cover sm:h-[320px] md:h-[380px]"
          />
        </div>
      </div>
    </section>
  );
}

export function Quality() {
  const t = useTranslations("about.quality");

  return (
    <section className="bg-white py-12 md:py-16 border-t border-zinc-100">
      <div className="container-brand px-4 md:px-8 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-3xl border border-zinc-100 shadow-md">
          <img
            src={getOptimizedUrl(
              "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            )}
            alt={t("imgAlt")}
            className="h-[300px] w-full object-cover sm:h-[360px]"
          />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 mb-3 border border-orange-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="heading-title text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-[32px] leading-tight">
            {t("title")}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-zinc-600">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function VisionObjectives() {
  const t = useTranslations("about.visionObjectives");

  return (
    <section className="bg-white py-12 md:py-16 border-t border-zinc-100">
      <div className="container-brand px-4 md:px-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Tarjeta Visión */}
        <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/50 p-8 transition-colors hover:border-orange-200 hover:bg-orange-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white mb-5 shadow-sm">
            <Eye className="h-6 w-6 text-orange-400" />
          </div>
          <h2 className="heading-title text-xl font-extrabold text-zinc-900 sm:text-2xl">
            {t("vision.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            {t("vision.text")}
          </p>
        </div>

        {/* Tarjeta Objetivos */}
        <div className="rounded-3xl border border-zinc-200/80 bg-zinc-50/50 p-8 transition-colors hover:border-orange-200 hover:bg-orange-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white mb-5 shadow-sm">
            <Target className="h-6 w-6" />
          </div>
          <h2 className="heading-title text-xl font-extrabold text-zinc-900 sm:text-2xl">
            {t("objectives.title")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            {t("objectives.text")}
          </p>
        </div>
      </div>
    </section>
  );
}