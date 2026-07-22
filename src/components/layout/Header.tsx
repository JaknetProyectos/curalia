"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Menu,
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  Home,
  Store,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("header");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, itemCount, total, updateQuantity, removeItem } = useCart();

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/tienda", label: t("nav.store"), icon: Store },
    { href: "/contacto", label: t("nav.contact"), icon: Mail },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
        <div className="container-brand flex h-20 items-center justify-between px-4 md:px-8">
          {/* Logo (Ya incluye su propio enlace <a> interno) */}
          <Logo />

          {/* Navegación Desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-orange-50 hover:text-orange-600"
                >
                  <Icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-orange-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            {/* Botón Carrito */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={t("cart.open")}
              className="relative flex h-11 items-center gap-2 rounded-full bg-zinc-900 px-4 text-white transition-all hover:bg-orange-600 active:scale-95"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden text-xs font-semibold sm:inline">{t("cart.title")}</span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white">
                {itemCount}
              </span>
            </button>

            {/* Botón Menú Móvil */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu.open")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 transition-colors hover:bg-zinc-100 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out navigation menu (Sidebar Original) */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={cn(
            "absolute right-0 top-0 flex h-full w-[300px] max-w-[85vw] flex-col bg-[hsl(var(--brand))] px-8 py-8 text-white shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t("menu.close")}
            className="mb-10 self-end text-white/80 transition-colors hover:text-white"
          >
            <X className="h-7 w-7" strokeWidth={1.6} />
          </button>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 border-b border-white/15 py-3 font-display text-lg tracking-wide text-white/90 transition-colors hover:text-white"
                  >
                    <Icon className="h-5 w-5 text-white/70" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto text-sm text-white/70">
            <p className="font-semibold text-white">Curalia</p>
            <p className="mt-1 flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-white/80" /> +52 1 55 2580 7319
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-white/80" /> info@curalia.com.mx
            </p>
          </div>
        </nav>
      </div>

      {/* Slide-out mini cart */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
        <aside
          className={cn(
            "absolute right-0 top-0 flex h-full w-[380px] max-w-[90vw] flex-col bg-white shadow-2xl transition-transform duration-300",
            cartOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <h2 className="font-display text-lg font-semibold tracking-wide text-[hsl(var(--ink))]">
                {t("cart.yourCart")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              aria-label={t("cart.close")}
              className="text-muted-foreground transition-colors hover:text-[hsl(var(--brand))]"
            >
              <X className="h-6 w-6" strokeWidth={1.6} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <ShoppingCart className="h-8 w-8" strokeWidth={1.2} />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("cart.empty")}
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-white">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="line-clamp-2 text-sm font-medium text-[hsl(var(--ink))]">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-orange-600">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                          <button
                            type="button"
                            aria-label={t("cart.decrease")}
                            className="px-2 py-1 text-muted-foreground hover:text-orange-600"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={t("cart.increase")}
                            className="px-2 py-1 text-muted-foreground hover:text-orange-600"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={t("cart.remove")}
                          className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-100 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-display text-lg font-semibold text-[hsl(var(--ink))]">
                    {formatPrice(total)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      MXN +IVA
                    </span>
                  </span>
                </div>
                <Link
                  href="/carrito"
                  onClick={() => setCartOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-center text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95"
                >
                  <span>{t("cart.checkout")}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}