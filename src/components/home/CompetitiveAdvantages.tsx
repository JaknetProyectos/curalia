"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, PackageCheck } from "lucide-react";

export function CompetitiveAdvantages() {
  const t = useTranslations("competitiveAdvantages");

  // Obtención segura del arreglo de ventajas
  const getAdvantages = (): string[] => {
    try {
      const items = t.raw("items");
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  };

  const advantages = getAdvantages();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-brand px-4 md:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200/80 bg-zinc-50/50 p-8 shadow-sm sm:p-12 md:p-16">
          <div className="flex flex-col items-center text-center">
            {/* Título de la sección */}
            <h2 className="heading-title text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl md:text-[34px]">
              {t("title")}
            </h2>

            {/* Subtítulo destacado */}
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-orange-100/80 px-5 py-2.5 text-base font-bold text-orange-900 sm:text-lg">
              <PackageCheck className="h-5 w-5 text-orange-600 shrink-0" />
              <span>{t("highlight")}</span>
            </div>

            {/* Lista de ventajas */}
            {advantages.length > 0 && (
              <ul className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 w-full">
                {advantages.map((advantage, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
                  >
                    <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-zinc-700">
                      {advantage}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}