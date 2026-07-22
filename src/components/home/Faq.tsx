"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export function Faq() {
  const t = useTranslations("faq");

  // Función segura para obtener la lista de FAQs
  const getFaqItems = (): FaqItem[] => {
    try {
      const items = t.raw("items");
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  };

  const faqItems = getFaqItems();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-brand max-w-3xl px-4 md:px-8">
        {/* Encabezado de la sección */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3.5 py-1 text-xs font-semibold text-orange-700">
            <HelpCircle className="h-3.5 w-3.5 text-orange-600" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="heading-title text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl md:text-[38px]">
            {t("title")}
          </h2>
        </div>

        {/* Acordeón de FAQs */}
        {faqItems.length > 0 && (
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-4"
          >
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-6 transition-all duration-200 data-[state=open]:border-orange-300 data-[state=open]:bg-white data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="py-5 text-left font-display text-base font-bold text-zinc-900 transition-colors hover:text-orange-600 hover:no-underline data-[state=open]:text-orange-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-zinc-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}