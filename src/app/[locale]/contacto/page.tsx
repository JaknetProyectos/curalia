"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { MapPin, Phone, Mail, ArrowRight, Send, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useContact } from "@/hooks/useContact"; // Ajusta la ruta a tu archivo de hook

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { sendContactForm, isLoading } = useContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mapeamos a las claves esperadas por la interfaz ContactData
    const result = await sendContactForm({
      nombre: form.name,
      email: form.email,
      mensaje: form.message,
    });

    if (result.success) {
      toast.success("¡Mensaje enviado!", {
        description: "Nos pondremos en contacto contigo muy pronto.",
      });
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error("No se pudo enviar el mensaje", {
        description: result.error || "Inténtalo de nuevo.",
      });
    }
  };

  return (
    <>
      {/* Hero Naranja */}
      <section className="bg-orange-600 py-20 text-center text-white">
        <div className="container-brand px-4 md:px-8">
          <h1 className="animate-fade-in-up font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            CONTACTO
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-orange-100">
            Estamos listos para ayudarte a elegir el equipo adecuado según tus
            necesidades clínicas o institucionales. No dudes en contactarnos.
          </p>
        </div>
      </section>

      {/* Contact info + form con fondo blanco */}
      <section className="bg-zinc-50 py-16 md:py-24">
        <div className="container-brand grid grid-cols-1 gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-16">
          {/* Información de contacto */}
          <div className="flex flex-col justify-center">
            <h2 className="heading-title text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              CONTÁCTANOS
            </h2>
            <p className="mt-3 text-base text-zinc-600">
              Comunícate con nosotros a través de los siguientes medios.
            </p>

            <div className="mt-8 space-y-6">
              <ContactRow icon={MapPin} title="DIRECCIÓN">
                Calle Guanajuato N°224, Piso 8,
                <br />
                Desp. 801-802, Col. Roma, Alcaldía Cuauhtémoc,
                <br />
                C.P. 06700, CDMX
              </ContactRow>
              <div className="border-t border-zinc-200" />
              <ContactRow icon={Phone} title="TELÉFONO">
                <a
                  href="tel:+525525807319"
                  className="font-medium text-zinc-800 transition-colors hover:text-orange-600"
                >
                  +52 1 55 2580 7319
                </a>
              </ContactRow>
              <div className="border-t border-zinc-200" />
              <ContactRow icon={Mail} title="CORREO">
                <a
                  href="mailto:info@curalia.com.mx"
                  className="font-medium text-zinc-800 transition-colors hover:text-orange-600"
                >
                  info@curalia.com.mx
                </a>
              </ContactRow>
            </div>
          </div>

          {/* Form Card con fondo Blanco */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl md:p-10">
            <h3 className="heading-title text-2xl font-bold text-zinc-900">
              ¡ESCRÍBENOS!
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Déjanos un mensaje y te responderemos a la brevedad.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Field label="NOMBRE">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ingresa tu nombre"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </Field>
              <Field label="CORREO ELECTRÓNICO">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Ingresa tu correo electrónico"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </Field>
              <Field label="MENSAJE">
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Ingresa tu mensaje"
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </Field>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-70"
              >
                <span>{isLoading ? "Enviando..." : "Enviar mensaje"}</span>
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
            PEDIDO PERSONALIZADO
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-orange-100">
            Equipamiento médico a tu medida.
            <br />
            Si aún no cuentas con una cotización, ¡comunícate con nosotros!
          </p>
          <div className="mt-8">
            <Link
              href="/personalizado"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-95"
            >
              <span>Realizar mi pago</span>
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
    <div className="flex gap-4 items-start">
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