"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import {
  ArrowRight,
  AlertCircle,
  Loader2,
  DollarSign,
  Check,
  FileText,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CustomProductPage() {
  const t = useTranslations("customPlan");
  const router = useRouter();
  const { addItem } = useCart();

  const [quoteNumber, setQuoteNumber] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | "">("");

  // Campos de contacto del cliente
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const finalPrice = Number(totalPrice) || 0;

    // Validaciones de todos los campos solicitados
    if (!firstName.trim()) {
      setError(t("errors.firstNameRequired"));
      return;
    }

    if (!email.trim()) {
      setError(t("errors.emailRequired"));
      return;
    }

    if (!quoteNumber.trim()) {
      setError(t("errors.quoteRequired"));
      return;
    }

    if (finalPrice <= 0) {
      setError(t("errors.invalidAmount"));
      return;
    }

    setIsAdding(true);

    const folioUpper = quoteNumber.trim().toUpperCase();
    const cleanFirstName = firstName.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Nombre del producto concatenado con todos los datos
    const customProductName = `Custom - ${folioUpper} (${cleanFirstName} - Email: ${cleanEmail})`;
    const customProductDescription = `Custom - ${folioUpper} (${cleanFirstName} - Email: ${cleanEmail})`;

    addItem(
      {
        image: "/logo.png",
        description: customProductDescription,
        id: `custom-quote-${quoteNumber.trim().toLowerCase()}`,
        name: customProductName,
        price: finalPrice,
        category: "custom",
        sku: "",
        slug: "custom-quote",
      },
      1
    );

    setTimeout(() => {
      setIsAdding(false);
      router.push("/carrito");
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 pb-32 text-white selection:bg-orange-500/30 selection:text-orange-400">
      {/* Halo radial de fondo en color naranja */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-28 lg:pt-36">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-md lg:p-14">
          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="space-y-3">

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-orange-500 sm:text-5xl lg:text-6xl">
                {t("hero.titleHighlight")}
              </h1>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t("hero.titleMain")}
              </h1>

              <h2 className="pt-6 font-display text-xl font-bold tracking-tight text-zinc-200 sm:text-2xl">
                {t("hero.subtitle")}
              </h2>

              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                {t("hero.description")}
              </p>

            </div>
          </div>
        </section>

        {/* Sección del Formulario */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10 lg:p-12">

            {/* Resplandor superior en la tarjeta */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />

            <div className="relative z-10 w-full">
              <div className="mb-8">
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-orange-500">
                  {t("form.badge")}
                </span>

                <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
                  {t("form.title")}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {t("authorized.description")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-sm font-medium text-red-400 backdrop-blur-md">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Grid para Nombre y Apellido */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Input Nombre */}
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="pl-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400"
                    >
                      {t("form.firstNameLabel")}
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder={t("form.firstNamePlaceholder")}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* Input Correo Electrónico */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="pl-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400"
                    >
                      {t("form.emailLabel")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder={t("form.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                {/* Input Folio/Cotización */}
                <div className="space-y-2">
                  <label
                    htmlFor="quoteNumber"
                    className="pl-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400"
                  >
                    {t("form.quoteLabel")}
                  </label>
                  <input
                    id="quoteNumber"
                    type="text"
                    required
                    placeholder={t("form.quotePlaceholder")}
                    value={quoteNumber}
                    onChange={(e) => setQuoteNumber(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 text-sm font-mono uppercase tracking-widest text-white outline-none transition-all placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* Input Monto total */}
                <div className="space-y-2">
                  <label
                    htmlFor="totalPrice"
                    className="pl-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400"
                  >
                    {t("form.amountLabel")}
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-orange-500">
                      <DollarSign className="h-4 w-4" />
                    </div>

                    <input
                      id="totalPrice"
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      placeholder={t("form.amountPlaceholder")}
                      value={totalPrice}
                      onChange={(e) =>
                        setTotalPrice(
                          e.target.value !== "" ? Number(e.target.value) : ""
                        )
                      }
                      className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-950 pl-11 pr-16 text-sm font-semibold text-white outline-none transition-all placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5">
                      <span className="text-xs font-bold tracking-wider text-zinc-500">
                        MXN
                      </span>
                    </div>
                  </div>

                  <p className="pl-1 text-[11px] text-zinc-500">
                    {t("form.taxNote")}
                  </p>
                </div>

                {/* Botón de envío - Botón Naranja Vibrante */}
                <div className="pt-4">
                  <motion.button
                    whileTap={!isAdding ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isAdding}
                    className={[
                      "group flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 shadow-lg",
                      isAdding
                        ? "cursor-not-allowed bg-zinc-800 text-zinc-500 border border-zinc-700"
                        : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 hover:shadow-orange-500/30",
                    ].join(" ")}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        <span>{t("buttons.adding")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("buttons.addToCart")}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}