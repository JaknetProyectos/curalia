"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Phone, Mail, ArrowRight, Send, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useContact } from "@/hooks/useContact";

export default function ContactoPage() {
  const t = useTranslations("contactPage");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { sendContactForm, isLoading } = useContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await sendContactForm({
      nombre: form.name,
      email: form.email,
      mensaje: form.message,
    });

    if (result.success) {
      toast.success(t("toast.successTitle"), {
        description: t("toast.successDescription"),
      });
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error(t("toast.errorTitle"), {
        description: result.error || t("toast.errorFallback"),
      });
    }
  };

  return (
    <>
      {/* Hero Naranja */}
      <section className="bg-orange-600 py-20 text-center text-white">
        <div className="container-brand px-4 md:px-8">
          <h1 className="animate-fade-in-up font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-orange-100">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="container-brand grid grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-16">
          {/* Información de contacto */}
          <div className="flex flex-col justify-center">
            <h2 className="heading-title text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {t("info.title")}
            </h2>
            <p className="mt-3 text-base text-zinc-600">
              {t("info.subtitle")}
            </p>

            <div className="mt-8 space-y-6">
              <ContactRow icon={MapPin} title={t("info.addressLabel")}>
                {t("info.addressLine1")}
                <br />
                {t("info.addressLine2")}
                <br />
                {t("info.addressLine3")}
              </ContactRow>
              <div className="border-t border-zinc-200" />
              <ContactRow icon={Phone} title={t("info.phoneLabel")}>
                <a
                  href="tel:+525525807319"
                  className="font-medium text-zinc-800 transition-colors hover:text-orange-600"
                >
                  +52 1 55 2580 7319
                </a>
              </ContactRow>
              <div className="border-t border-zinc-200" />
              <ContactRow icon={Mail} title={t("info.emailLabel")}>
                <a
                  href="mailto:info@curalia.com.mx"
                  className="font-medium text-zinc-800 transition-colors hover:text-orange-600"
                >
                  info@curalia.com.mx
                </a>
              </ContactRow>
            </div>
          </div>

          {/* Tarjeta de Formulario */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl md:p-10">
            <h3 className="heading-title text-2xl font-bold text-zinc-900">
              {t("form.title")}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {t("form.subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Field label={t("form.nameLabel")}>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("form.namePlaceholder")}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </Field>
              <Field label={t("form.emailLabel")}>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("form.emailPlaceholder")}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </Field>
              <Field label={t("form.messageLabel")}>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder={t("form.messagePlaceholder")}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </Field>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-70"
              >
                <span>
                  {isLoading ? t("form.sendingButton") : t("form.submitButton")}
                </span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Pedido personalizado Naranja */}
      <section className="bg-orange-500 py-20 text-center text-white">
        <div className="container-brand px-4 md:px-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("customOrder.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-orange-100">
            {t("customOrder.description1")}
            <br />
            {t("customOrder.description2")}
          </p>
          <div className="mt-8">
            <Link
              href="/personalizado"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-95"
            >
              <span>{t("customOrder.ctaButton")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <h4 className="font-display text-sm font-bold uppercase tracking-wider text-orange-600">
          {title}
        </h4>
        <div className="mt-1 text-sm leading-relaxed text-zinc-600">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}