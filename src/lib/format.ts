/** Formats a number as Mexican pesos, e.g. 2335.08 -> "$2,335.08". */
export const formatPrice = (
  amount: number,
  currency: string = "MXN",
  includeCurrency: boolean = false
): string => {
  const formatted = new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return includeCurrency
    ? `${currency} $${formatted}`
    : `${formatted} `
}

/** Splits a price into the "$X,XXX.XX" amount and the "MXN +IVA" suffix. */
export function priceParts(value: number) {
  return {
    amount: formatPrice(value),
    suffix: "MXN +IVA",
  };
}


