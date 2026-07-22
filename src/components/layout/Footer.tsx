"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Phone, MapPin, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { loading, categories } = useCategories();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/#acerca", label: t("nav.about") },
    { href: "/tienda", label: t("nav.store") },
    { href: "/contacto", label: t("nav.contact") },
  ];

  const legalLinks = [
    { href: "/legal/terminos", label: t("legal.terms") },
    { href: "/legal/privacidad", label: t("legal.privacy") },
    { href: "/legal/reembolsos", label: t("legal.returns") },
  ];

  // Helper para obtener el nombre traducido de la categoría desde la DB
  const getCategoryName = (cat: any) => {
    if (typeof cat.name === "object" && cat.name !== null) {
      return cat.name[locale] || cat.name.es || cat.name.en || "";
    }
    return cat.name ?? "";
  };

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white">
      <div className="container-brand grid grid-cols-1 gap-10 px-4 py-16 md:px-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.4fr_1fr]">
        {/* Columna Tienda / Categorías */}
        <div>
          <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-orange-500">
            {t("sections.store")}
          </h3>
          <ul className="space-y-3 text-sm">
            {!loading &&
              Array.isArray(categories) &&
              categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categoria-producto/${cat.slug}`}
                    className="text-zinc-400 transition-colors hover:text-orange-400"
                  >
                    {getCategoryName(cat)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Columna Navegación */}
        <div>
          <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-orange-500">
            {t("sections.navigation")}
          </h3>
          <ul className="space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-400 transition-colors hover:text-orange-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna Contacto */}
        <div>
          <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-orange-500">
            {t("sections.contact")}
          </h3>
          <ul className="space-y-3.5 text-sm text-zinc-400">
            <li>
              <a
                href="tel:+525525807319"
                className="flex items-center gap-2.5 transition-colors hover:text-orange-400"
              >
                <Phone className="h-4 w-4 shrink-0 text-orange-500" />
                <span>+52 1 55 2580 7319</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="h-4 w-4 shrink-0 text-orange-500 mt-1" />
              <span>{t("address")}</span>
            </li>
            <li>
              <a
                href="mailto:info@curalia.com.mx"
                className="flex items-center gap-2.5 transition-colors hover:text-orange-400"
              >
                <Mail className="h-4 w-4 shrink-0 text-orange-500" />
                <span>info@curalia.com.mx</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Columna Logo y Métodos de Pago */}
        <div className="flex flex-col items-start gap-6">
          <div className="rounded-2xl bg-zinc-900/80 p-3 border border-zinc-800">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/cards.png"
              alt={t("paymentMethods")}
              width={150}
              height={20}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Sub-footer con Copyright y Links Legales */}
      <div className="border-t border-zinc-900 bg-zinc-950/80">
        <div className="container-brand flex flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-zinc-500 md:px-8 md:flex-row md:items-center">
          <p>{t("copyright")}</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-orange-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}