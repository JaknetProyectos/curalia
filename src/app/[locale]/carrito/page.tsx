"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  CreditCard,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useCart } from "@/context/CartContext";

import { processKeycopPayment } from "@/lib/payment";
import { formatPrice } from "@/lib/format";
import { useProducts } from "@/hooks/useProducts";

const VALID_COUPONS = [
  { code: "VEX10", discount: 0.1 },
  { code: "VEX15", discount: 0.15 },
  { code: "VEXPRO20", discount: 0.2 },
];

const BACK_CATALOG_LINK = "/tienda";

type Step = 1 | 2 | 3;

function CardShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border border-orange-400/30",
        "bg-white shadow-xl text-zinc-900 transition-all duration-300",
        className,
      ].join(" ")}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
        {title}
      </h3>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  className = "",
  maxLength,
  mono = false,
  inputClassName = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  mono?: boolean;
  inputClassName?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-600">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={[
          "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3",
          "text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400",
          "focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20",
          mono ? "font-mono tracking-widest" : "",
          inputClassName,
        ].join(" ")}
      />
    </div>
  );
}

export default function CarritoCheckoutPage() {
  const t = useTranslations("cartPage");
  const locale = useLocale();
  const { products, loading } = useProducts();

  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    empresa: "",
    direccion: "",
    direccion2: "",
    ciudad: "",
    estado: "",
    cp: "",
    pais: "MX",
    cardNumber: "",
    cardName: "",
    cardMonth: "",
    cardYear: "",
    cardCvv: "",
  });

  const discountAmount = appliedCoupon ? total * appliedCoupon.discount : 0;
  const totalWithDiscount = total - discountAmount;
  const iva = totalWithDiscount * 0.16;
  const grandTotal = totalWithDiscount + iva;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const found = VALID_COUPONS.find(
      (c) => c.code === couponInput.trim().toUpperCase()
    );

    if (found) {
      setAppliedCoupon(found);
      setCouponInput("");
      return;
    }

    setCouponError(t("financial.couponInvalid"));
  };

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    const uniqueOrderId = `MC-${Date.now()}`;

    const paymentPayload = {
      amount: Number(grandTotal.toFixed(2)),
      orderId: uniqueOrderId,
      cardData: {
        number: formData.cardNumber.replace(/\s/g, ""),
        name: formData.cardName.trim(),
        month: formData.cardMonth.padStart(2, "0"),
        year: formData.cardYear.trim(),
        cvv: formData.cardCvv.trim(),
      },
      customer: {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        direccion2: formData.direccion2.trim() || undefined,
        ciudad: formData.ciudad.trim(),
        estado: formData.estado.trim(),
        pais: formData.pais,
        cp: formData.cp.trim(),
        empresa: formData.empresa.trim() || undefined,
      },
      metadata: {
        notes: appliedCoupon
          ? `${t("metadata.couponApplied")}: ${appliedCoupon.code}`
          : t("metadata.standardSale"),
      },
    };

    try {
      const response = await processKeycopPayment(paymentPayload);

      if (response.success) {
        setSuccessData(response.data);

        try {
          await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: uniqueOrderId,
              amount: paymentPayload.amount,
              customer: paymentPayload.customer,
              items,
              metadata: paymentPayload.metadata,
              locale,
            }),
          });
        } catch (emailError) {
          console.error(
            "⚠️ Falló el despacho de correos informativos:",
            emailError
          );
        }

        clearCart();
        setStep(3);
      } else {
        setErrorMessage(response.error || t("errors.declined"));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(t("errors.connection"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-orange-600 text-white">
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 pb-14 pt-32 md:px-6">
          <section className="relative mx-auto w-full max-w-xl">
            <CardShell className="p-8 text-center sm:p-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                {t("success.title")}
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
                {t("success.description")}
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-left">
                <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3">
                  <span className="text-xs font-semibold text-zinc-600">
                    {t("success.transactionStatus")}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {t("success.approved")}
                  </span>
                </div>
              </div>

              <Link href={BACK_CATALOG_LINK} className="mt-8 block">
                <button className="w-full rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-zinc-800">
                  {t("success.backToCatalog")}
                </button>
              </Link>
            </CardShell>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-600 text-white selection:bg-zinc-900 selection:text-white pb-20">
      <div className="h-4" />

      {/* Header Sticky / Breadcrumbs */}
      <div className="sticky top-0 z-40 border-b border-orange-500/50 bg-orange-600/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-orange-100">
            <Link href="/" className="transition hover:text-white">
              {t("breadcrumb.home")}
            </Link>
            <span className="text-orange-300">/</span>
            <span
              className={
                step === 1 ? "font-bold text-white" : "text-orange-200"
              }
            >
              {t("breadcrumb.summary")}
            </span>
            <span className="text-orange-300">/</span>
            <span
              className={
                step === 2 ? "font-bold text-white" : "text-orange-200"
              }
            >
              {t("breadcrumb.shippingPayment")}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                step >= 1 ? "bg-white" : "bg-orange-800"
              }`}
            />
            <div
              className={`h-0.5 w-12 rounded-full transition-colors duration-300 ${
                step >= 2 ? "bg-white" : "bg-orange-800"
              }`}
            />
            <div
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                step >= 2 ? "bg-white" : "bg-orange-800"
              }`}
            />
          </div>
        </div>
      </div>

      <main className="relative z-10 py-6 md:py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {items.length === 0 ? (
            <CardShell className="mx-auto max-w-lg p-8 text-center sm:p-10">
              <ShoppingBag className="mx-auto mb-5 h-14 w-14 text-orange-500" />
              <h2 className="text-2xl font-bold text-zinc-900">
                {t("empty.title")}
              </h2>
              <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-zinc-500">
                {t("empty.description")}
              </p>
              <Link href={BACK_CATALOG_LINK} className="mt-8 inline-block">
                <button className="rounded-2xl bg-orange-500 px-8 py-4 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-orange-600">
                  {t("empty.goToStore")}
                </button>
              </Link>
            </CardShell>
          ) : (
            <div className="space-y-6">
              {errorMessage && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-4 text-xs font-semibold text-red-600 shadow-lg">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Paso 1: Resumen de Carrito */}
              {step === 1 && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
                  <CardShell className="p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                        {t("order.title")}
                      </h2>

                      <button
                        type="button"
                        onClick={clearCart}
                        className="flex items-center gap-1.5 text-xs font-bold text-red-500 transition hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("order.clear")}
                      </button>
                    </div>

                    <div className="mt-6 space-y-4">
                      {!loading &&
                        items.map((item) => {
                          const matchingSolution = products.find(
                            (product) => product.id === item.product.id
                          );
                          const displayProduct =
                            matchingSolution || item.product;

                          return (
                            <div
                              key={displayProduct.id}
                              className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all duration-300 hover:border-orange-200 hover:bg-white"
                            >
                              <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-2 border border-zinc-100">
                                  <Link
                                    href={`/tienda/${displayProduct.id}`}
                                    className="absolute inset-0 z-10"
                                  />
                                  <Image
                                    src={displayProduct.image || "/logo.png"}
                                    alt={displayProduct.name}
                                    fill
                                    className="object-contain p-1 transition-transform duration-500 hover:scale-105"
                                  />
                                </div>

                                <div className="flex min-w-0 flex-col justify-between gap-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="mb-1 inline-block font-mono text-[9px] font-bold text-zinc-400">
                                        {displayProduct.id}
                                      </p>

                                      <h3 className="line-clamp-1 text-sm font-extrabold text-zinc-900">
                                        {displayProduct.name}
                                      </h3>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeItem(displayProduct.id)
                                      }
                                      className="rounded-xl p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                                      aria-label="Eliminar artículo"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>

                                  <div className="flex items-end justify-between gap-4">
                                    <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-0.5 shadow-sm">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateQuantity(
                                            displayProduct.id,
                                            item.quantity - 1
                                          )
                                        }
                                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-orange-600"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </button>

                                      <span className="w-8 text-center font-mono text-xs font-bold text-zinc-900">
                                        {item.quantity}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateQuantity(
                                            displayProduct.id,
                                            item.quantity + 1
                                          )
                                        }
                                        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-orange-600"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </button>
                                    </div>

                                    <span className="text-sm font-black text-zinc-900">
                                      {formatPrice(
                                        displayProduct.price * item.quantity,
                                        "MXN",
                                        true
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardShell>

                  {/* Sidebar Financiero Paso 1 */}
                  <CardShell className="p-6 sm:p-8">
                    <div className="flex h-full flex-col">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-4">
                        {t("financial.title")}
                      </h2>

                      <div className="mt-5 flex items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                        <Image
                          src="/logo-keycop.webp"
                          alt={t("images.securePaymentAlt")}
                          width={140}
                          height={20}
                          className="object-contain"
                        />
                      </div>

                      <div className="mt-5 space-y-4">
                        {!appliedCoupon ? (
                          <form
                            onSubmit={handleApplyCoupon}
                            className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                          >
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                {t("financial.applyCoupon")}
                              </p>
                              <p className="mt-0.5 text-[11px] text-zinc-500">
                                {t("financial.couponPlaceholder")}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder={t("financial.couponPlaceholder")}
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-orange-500"
                              />
                              <button
                                type="submit"
                                className="shrink-0 rounded-xl bg-zinc-900 px-4 text-xs font-bold text-white transition hover:bg-zinc-800"
                              >
                                {t("financial.applyCoupon")}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                                  {t("financial.appliedCoupon", {
                                    code: appliedCoupon.code,
                                    discount: appliedCoupon.discount * 100,
                                  })}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => setAppliedCoupon(null)}
                                className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-red-600 transition hover:bg-red-50"
                              >
                                {t("financial.remove")}
                              </button>
                            </div>
                          </div>
                        )}

                        {couponError && (
                          <p className="text-[10px] font-semibold text-red-500">
                            ⚠️ {couponError}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-600">
                        <div className="flex justify-between gap-4">
                          <span>{t("financial.subtotal")}</span>
                          <span className="font-mono font-bold text-zinc-900">
                            {formatPrice(total, "MXN", true)}
                          </span>
                        </div>

                        {appliedCoupon && (
                          <div className="flex justify-between gap-4 text-emerald-600">
                            <span>{t("financial.discount")}</span>
                            <span className="font-mono font-bold">
                              -{formatPrice(discountAmount, "MXN", true)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-900 p-5 text-white">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {t("financial.netTotal")}
                          </span>
                          <span className="text-2xl font-black">
                            {formatPrice(grandTotal, "MXN", true)}
                          </span>
                        </div>

                        <p className="mt-1 text-right text-[10px] text-zinc-400">
                          {t("financial.tax", {
                            tax: formatPrice(iva, "MXN", true),
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-orange-600"
                      >
                        {t("actions.proceedToPayment")}
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <div className="mt-5 border-t border-zinc-100 pt-4 text-center">
                        <p className="text-[10px] text-zinc-400">
                          {t("security.note")}
                        </p>
                        <div className="mt-3 flex items-center justify-center">
                          <Image
                            src="/secure-payment.png"
                            alt={t("images.securePaymentAlt")}
                            width={100}
                            height={20}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </CardShell>
                </div>
              )}

              {/* Paso 2: Checkout Form de 2 Columnas (Forms a la izq en 1 sola columna / Card de Pago a la der) */}
              {step === 2 && (
                <form
                  id="octano-payment-form"
                  onSubmit={handleCheckoutSubmit}
                  className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]"
                >
                  {/* Columna Izquierda: Los 3 formularios agrupados verticalmente */}
                  <div className="space-y-6">
                    {/* Formulario 1: Datos del Comprador */}
                    <CardShell className="p-6 sm:p-8">
                      <SectionTitle
                        icon={User}
                        title={t("form.buyerTitle")}
                      />

                      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label={t("form.firstName")}
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.lastName")}
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.email")}
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.phone")}
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.company")}
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleInputChange}
                          className="sm:col-span-2"
                        />
                      </div>
                    </CardShell>

                    {/* Formulario 2: Dirección de Envío */}
                    <CardShell className="p-6 sm:p-8">
                      <SectionTitle
                        icon={MapPin}
                        title={t("form.addressTitle")}
                      />

                      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label={t("form.streetAddress")}
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          required
                          placeholder={t("form.streetAddressPlaceholder")}
                          className="sm:col-span-2"
                        />
                        <Field
                          label={t("form.neighborhood")}
                          name="direccion2"
                          value={formData.direccion2}
                          onChange={handleInputChange}
                          placeholder={t("form.neighborhoodPlaceholder")}
                          className="sm:col-span-2"
                        />
                        <Field
                          label={t("form.city")}
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.state")}
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          placeholder={t("form.statePlaceholder")}
                        />
                        <Field
                          label={t("form.postalCode")}
                          name="cp"
                          value={formData.cp}
                          onChange={handleInputChange}
                          required
                        />
                        <div>
                          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-600">
                            {t("form.country")}
                          </label>
                          <select
                            name="pais"
                            value={formData.pais}
                            onChange={handleInputChange}
                            className="w-full appearance-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-900 outline-none transition-all focus:border-orange-500 focus:bg-white"
                          >
                            <option value="MX">{t("form.mexico")}</option>
                          </select>
                        </div>
                      </div>
                    </CardShell>

                    {/* Formulario 3: Datos de Tarjeta de Crédito */}
                    <CardShell className="p-6 sm:p-8">
                      <SectionTitle
                        icon={CreditCard}
                        title={t("form.paymentTitle")}
                      />

                      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6">
                        <Field
                          label={t("form.cardNumber")}
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          maxLength={16}
                          placeholder={t("form.cardNumberPlaceholder")}
                          className="sm:col-span-6"
                          mono
                        />
                        <Field
                          label={t("form.cardHolderName")}
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          placeholder={t("form.cardHolderPlaceholder")}
                          className="sm:col-span-6"
                        />
                        <Field
                          label={t("form.expiryMonth")}
                          name="cardMonth"
                          value={formData.cardMonth}
                          onChange={handleInputChange}
                          required
                          maxLength={2}
                          placeholder={t("form.expiryMonthPlaceholder")}
                          mono
                          inputClassName="text-center"
                          className="sm:col-span-2"
                        />
                        <Field
                          label={t("form.expiryYear")}
                          name="cardYear"
                          value={formData.cardYear}
                          onChange={handleInputChange}
                          required
                          maxLength={4}
                          placeholder={t("form.expiryYearPlaceholder")}
                          mono
                          inputClassName="text-center"
                          className="sm:col-span-2"
                        />
                        <Field
                          label={t("form.cvv")}
                          name="cardCvv"
                          type="password"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          required
                          maxLength={4}
                          placeholder={t("form.cvvPlaceholder")}
                          mono
                          inputClassName="text-center"
                          className="sm:col-span-2"
                        />
                      </div>
                    </CardShell>
                  </div>

                  {/* Columna Derecha: Card de Resumen de Pago Fijo */}
                  <div className="lg:sticky lg:top-24 h-fit">
                    <CardShell className="p-6 sm:p-8">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-4">
                        {t("financial.title")}
                      </h2>

                      <div className="mt-5 flex items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                        <Image
                          src="/logo-keycop.webp"
                          alt={t("images.securePaymentAlt")}
                          width={140}
                          height={20}
                          className="object-contain"
                        />
                      </div>

                      <div className="mt-5 space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-xs text-zinc-600">
                        <div className="flex justify-between gap-4">
                          <span>{t("financial.subtotal")}</span>
                          <span className="font-mono font-bold text-zinc-900">
                            {formatPrice(total, "MXN", true)}
                          </span>
                        </div>

                        {appliedCoupon && (
                          <div className="flex justify-between gap-4 text-emerald-600">
                            <span>{t("financial.discount")}</span>
                            <span className="font-mono font-bold">
                              -{formatPrice(discountAmount, "MXN", true)}
                            </span>
                          </div>
                        )}

                        <div className="border-t border-zinc-200 pt-3">
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="text-xs font-bold text-zinc-900 uppercase">
                              {t("financial.netTotal")}
                            </span>
                            <span className="text-2xl font-black text-zinc-900">
                              {formatPrice(grandTotal, "MXN", true)}
                            </span>
                          </div>

                          <p className="mt-1 text-right text-[10px] text-zinc-400">
                            {t("financial.tax", {
                              tax: formatPrice(iva, "MXN", true),
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <button
                          type="submit"
                          form="octano-payment-form"
                          disabled={isProcessing}
                          className={[
                            "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg",
                            isProcessing
                              ? "cursor-wait bg-zinc-400"
                              : "bg-zinc-900 hover:bg-zinc-800",
                          ].join(" ")}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{t("actions.processing")}</span>
                            </span>
                          ) : (
                            t("actions.payAmount", {
                              amount: formatPrice(grandTotal, "MXN", true),
                            })
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => setStep(1)}
                          className="flex w-full items-center justify-center gap-1 py-2 text-xs font-bold text-zinc-500 transition hover:text-zinc-900"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          {t("actions.backToCart")}
                        </button>
                      </div>

                      <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
                        <p className="text-[10px] text-zinc-400">
                          {t("security.note")}
                        </p>

                        <div className="mt-3 flex items-center justify-center">
                          <Image
                            src="/secure-payment.png"
                            alt={t("images.securePaymentAlt")}
                            width={100}
                            height={20}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </CardShell>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}