"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { products } from "@/data/products";

export interface CatalogBlock {
  heading?: string;
  items?: string[];
  paragraph?: string;
}

export interface CatalogCard {
  categorySlug: string;
  title: string;
  image: string;
  intro: string;
  blocks: CatalogBlock[];
}

/** Pick a representative product image for a category. */
function categoryImage(slug: string, fallback: string) {
  const first = products.find((p) => p.category === slug);
  return first?.image ?? fallback;
}

export function CategoryCatalog() {
  const t = useTranslations("categoryCatalog");

  // Función segura para obtener arreglos de traducción
  const getArray = (key: string): string[] => {
    try {
      const res = t.raw(key);
      return Array.isArray(res) ? res : [];
    } catch {
      return [];
    }
  };

  const catalogCards: CatalogCard[] = [
    {
      categorySlug: "aspiradores",
      title: t("categories.aspiradores.title"),
      image: "/home/chair.wepb",
      intro: t("categories.aspiradores.intro"),
      blocks: [
        {
          heading: t("categories.aspiradores.blocks.applications.heading"),
          items: getArray("categories.aspiradores.blocks.applications.items"),
        },
        {
          heading: t("categories.aspiradores.blocks.features.heading"),
          items: getArray("categories.aspiradores.blocks.features.items"),
        },
      ],
    },
    {
      categorySlug: "auxiliares-para-bano",
      title: t("categories.auxiliaresParaBano.title"),
      image: "https://ext.same-assets.com/1549156260/2529295089.webp",
      intro: t("categories.auxiliaresParaBano.intro"),
      blocks: [
        {
          heading: t("categories.auxiliaresParaBano.blocks.includes.heading"),
          items: getArray("categories.auxiliaresParaBano.blocks.includes.items"),
        },
        {
          heading: t("categories.auxiliaresParaBano.blocks.benefits.heading"),
          items: getArray("categories.auxiliaresParaBano.blocks.benefits.items"),
        },
      ],
    },
    {
      categorySlug: "desfibriladores",
      title: t("categories.desfibriladores.title"),
      image: "https://ext.same-assets.com/1549156260/1230244526.webp",
      intro: t("categories.desfibriladores.intro"),
      blocks: [
        {
          heading: t("categories.desfibriladores.blocks.idealFor.heading"),
          items: getArray("categories.desfibriladores.blocks.idealFor.items"),
        },
        {
          heading: t("categories.desfibriladores.blocks.keyFeatures.heading"),
          items: getArray("categories.desfibriladores.blocks.keyFeatures.items"),
        },
      ],
    },
    {
      categorySlug: "dosificacion-de-medicamentos",
      title: t("categories.dosificacionDeMedicamentos.title"),
      image: "https://ext.same-assets.com/1549156260/1701065268.webp",
      intro: t("categories.dosificacionDeMedicamentos.intro"),
      blocks: [
        {
          heading: t("categories.dosificacionDeMedicamentos.blocks.includes.heading"),
          items: getArray("categories.dosificacionDeMedicamentos.blocks.includes.items"),
        },
        {
          heading: t("categories.dosificacionDeMedicamentos.blocks.benefits.heading"),
          items: getArray("categories.dosificacionDeMedicamentos.blocks.benefits.items"),
        },
      ],
    },
    {
      categorySlug: "habitacion-del-paciente",
      title: t("categories.habitacionDelPaciente.title"),
      image: "https://ext.same-assets.com/1549156260/2290844083.webp",
      intro: t("categories.habitacionDelPaciente.intro"),
      blocks: [
        {
          heading: t("categories.habitacionDelPaciente.blocks.includes.heading"),
          items: getArray("categories.habitacionDelPaciente.blocks.includes.items"),
        },
        {
          heading: t("categories.habitacionDelPaciente.blocks.features.heading"),
          items: getArray("categories.habitacionDelPaciente.blocks.features.items"),
        },
      ],
    },
    {
      categorySlug: "mobiliario-y-equipo-medico",
      title: t("categories.mobiliarioYEquipoMedico.title"),
      image: "https://ext.same-assets.com/1549156260/3944106040.webp",
      intro: t("categories.mobiliarioYEquipoMedico.intro"),
      blocks: [
        {
          heading: t("categories.mobiliarioYEquipoMedico.blocks.includes1.heading"),
          items: getArray("categories.mobiliarioYEquipoMedico.blocks.includes1.items"),
        },
        {
          paragraph: t("categories.mobiliarioYEquipoMedico.blocks.paragraph1"),
        },
        {
          heading: t("categories.mobiliarioYEquipoMedico.blocks.diagnosis.heading"),
          paragraph: t("categories.mobiliarioYEquipoMedico.blocks.diagnosis.paragraph"),
        },
        {
          heading: t("categories.mobiliarioYEquipoMedico.blocks.includes2.heading"),
          items: getArray("categories.mobiliarioYEquipoMedico.blocks.includes2.items"),
        },
      ],
    },
    {
      categorySlug: "monitores",
      title: t("categories.monitores.title"),
      image: "https://ext.same-assets.com/1549156260/2619432628.webp",
      intro: t("categories.monitores.intro"),
      blocks: [
        {
          heading: t("categories.monitores.blocks.functions.heading"),
          items: getArray("categories.monitores.blocks.functions.items"),
        },
        {
          paragraph: t("categories.monitores.blocks.paragraph"),
        },
      ],
    },
    {
      categorySlug: "movilidad",
      title: t("categories.movilidad.title"),
      image: "https://ext.same-assets.com/1549156260/804806984.webp",
      intro: t("categories.movilidad.intro"),
      blocks: [
        {
          heading: t("categories.movilidad.blocks.includes.heading"),
          items: getArray("categories.movilidad.blocks.includes.items"),
        },
        {
          heading: t("categories.movilidad.blocks.advantages.heading"),
          items: getArray("categories.movilidad.blocks.advantages.items"),
        },
      ],
    },
    {
      categorySlug: "terapia-respiratoria",
      title: t("categories.terapiaRespiratoria.title"),
      image: "https://ext.same-assets.com/1549156260/26249274.webp",
      intro: t("categories.terapiaRespiratoria.intro"),
      blocks: [
        {
          heading: t("categories.terapiaRespiratoria.blocks.includes.heading"),
          items: getArray("categories.terapiaRespiratoria.blocks.includes.items"),
        },
        {
          heading: t("categories.terapiaRespiratoria.blocks.benefits.heading"),
          items: getArray("categories.terapiaRespiratoria.blocks.benefits.items"),
        },
      ],
    },
  ];

  return (
    <section className="bg-orange-500 py-16 md:py-24">
      <div className="container-brand px-4 md:px-8">
        <h2 className="heading-title mb-12 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-[38px]">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {catalogCards.map((card) => (
            <article
              key={card.categorySlug}
              className="group flex flex-col rounded-3xl border border-orange-200/40 bg-white p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              {/* Imagen del producto/categoría */}
              <Link
                href={`/categoria-producto/${card.categorySlug}`}
                className="mb-6 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 p-4 transition-colors group-hover:bg-orange-50/60"
              >
                <img
                  src={categoryImage(card.categorySlug, card.image)}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Título de categoría */}
              <Link href={`/categoria-producto/${card.categorySlug}`}>
                <h3 className="text-center font-display text-xl font-bold uppercase tracking-wide text-zinc-900 transition-colors hover:text-orange-600">
                  {card.title}
                </h3>
              </Link>

              {/* Descripción breve */}
              <p className="mt-3 text-center text-sm leading-relaxed text-zinc-600">
                {card.intro}
              </p>

              {/* Bloques de detalle e ítems */}
              <div className="mt-6 flex-1 space-y-4 rounded-2xl bg-zinc-50/80 p-4 text-center border border-zinc-100">
                {card.blocks.map((block, i) => (
                  <div key={i} className="text-center">
                    {block.heading && (
                      <p className="text-sm font-bold text-zinc-900">
                        {block.heading}
                      </p>
                    )}
                    {Array.isArray(block.items) && block.items.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                        {block.items.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {block.paragraph && (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                        {block.paragraph}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón de acción */}
              <div className="mt-6 flex justify-center">
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95"
                >
                  <span>{t("viewInStore")}</span>
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}