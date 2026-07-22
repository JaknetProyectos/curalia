"use client";

import { useTranslations } from "next-intl";
import { CreditCard, BadgeDollarSign, HeadphonesIcon } from "lucide-react";

export function Features() {
  const t = useTranslations("features");

  const features = [
    {
      icon: CreditCard,
      title: t("payment.title"),
      text: t("payment.text"),
    },
    {
      icon: BadgeDollarSign,
      title: t("prices.title"),
      text: t("prices.text"),
    },
    {
      icon: HeadphonesIcon,
      title: t("support.title"),
      text: t("support.text"),
    },
  ];

  return (
    <section className="bg-zinc-950 py-16 text-white md:py-20 border-y border-zinc-900">
      <div className="container-brand grid grid-cols-1 gap-6 px-4 sm:grid-cols-3 md:gap-8 md:px-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50 hover:bg-zinc-900 hover:shadow-xl hover:shadow-orange-500/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <Icon className="h-8 w-8" strokeWidth={1.75} />
              </div>
              <h3 className="mt-6 font-display text-base font-bold tracking-wider text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {feature.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}