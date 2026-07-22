import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPPORT_EMAIL = "info@curalia.com.mx";
const BRAND_NAME = "Curalia";
const BRAND_URL = "curalia.com.mx";
const BRAND_LOGO = "https://curalia.com.mx/title-logo.png";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, orderId, amount, customer, items, metadata } = body;

    // Inicializamos traducciones dinámicas con el locale recibido
    const t = await getTranslations({ locale, namespace: "Emails.checkout" });

    if (!orderId || !amount || !customer || !items) {
      return NextResponse.json(
        { error: t("errorMissingFields") },
        { status: 400 }
      );
    }

    const formattedAmount = amount.toFixed(2);

    // 1. EMAIL PARA EL CLIENTE (TICKET / RECIBO DE COMPRA - FONDO BLANCO / ACCENTOS NARANJA)
    const clientReceiptHtml = renderReceiptTemplate({
      title: t("client.title"),
      subtitle: t("client.subtitle", { orderId }),
      orderId,
      amount,
      customer,
      items,
      metadata,
      isBusiness: false,
      t,
    });

    await resend.emails.send({
      from: `${BRAND_NAME} <${SUPPORT_EMAIL}>`,
      to: customer.email,
      subject: t("client.subject", { orderId, brandName: BRAND_NAME }),
      html: clientReceiptHtml,
    });

    // 2. EMAIL PARA EL NEGOCIO (NOTIFICACIÓN DE VENTA - FONDO NEGRO / ACCENTOS NARANJA)
    const businessNotificationHtml = renderReceiptTemplate({
      title: t("business.title"),
      subtitle: t("business.subtitle", { amount: formattedAmount }),
      orderId,
      amount,
      customer,
      items,
      metadata,
      isBusiness: true,
      t,
    });

    await resend.emails.send({
      from: `${BRAND_NAME} Sales <${SUPPORT_EMAIL}>`,
      to: SUPPORT_EMAIL, // Corregido para enviarse al correo de soporte en lugar del cliente
      subject: t("business.subject", { orderId, amount: formattedAmount }),
      html: businessNotificationHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error" },
      { status: 500 }
    );
  }
}

// Función helper para generar el HTML del ticket
function renderReceiptTemplate({
  title,
  subtitle,
  orderId,
  amount,
  customer,
  items,
  metadata,
  isBusiness,
  t,
}: {
  title: string;
  subtitle: string;
  orderId: string;
  amount: number;
  customer: any;
  items: any[];
  metadata: any;
  isBusiness: boolean;
  t: any;
}) {
  // Configuración de paletas de color
  // Negocio (isBusiness: true)  -> Tema Negro / Naranja Vibrante
  // Cliente (isBusiness: false) -> Tema Blanco / Acentos Naranja
  const theme = isBusiness
    ? {
        bodyBg: "#09090b",            // Fondo general zinc-950 (negro profundo)
        containerBg: "#18181b",       // Contenedor principal zinc-900
        containerBorder: "#27272a",   // Borde sutil zinc-800
        headerBg: "#09090b",          // Cabecera oscura
        textColor: "#ffffff",         // Blanco
        textMuted: "#a1a1aa",         // Gris claro zinc-400
        cardBg: "#09090b",            // Tarjetas zinc-950
        cardBorder: "#27272a",        // Borde zinc-800
        dashedBorder: "#3f3f46",      // Borde punteado zinc-700
        labelColor: "#f97316",        // Naranja-500
        accentColor: "#f97316",       // Naranja brillante
        totalLabelColor: "#ffffff",
        totalAmountColor: "#f97316",
        badgeBg: "rgba(249, 115, 22, 0.15)",
        badgeText: "#fb923c",
        footerBg: "#09090b",
        footerLink: "#f97316",
      }
    : {
        bodyBg: "#f4f4f5",            // Fondo zinc-100 suave
        containerBg: "#ffffff",       // Blanco puro
        containerBorder: "#e4e4e7",   // Borde sutil zinc-200
        headerBg: "#ffffff",
        textColor: "#09090b",         // Texto principal zinc-950
        textMuted: "#71717a",         // Gris zinc-500
        cardBg: "#fafafa",            // Fondo tarjeta zinc-50
        cardBorder: "#e4e4e7",        // Borde zinc-200
        dashedBorder: "#d4d4d8",      // Borde punteado zinc-300
        labelColor: "#f97316",        // Naranja-500
        accentColor: "#ea580c",       // Naranja oscuro
        totalLabelColor: "#09090b",
        totalAmountColor: "#ea580c",
        badgeBg: "rgba(249, 115, 22, 0.1)",
        badgeText: "#c2410c",
        footerBg: "#fafafa",
        footerLink: "#f97316",
      };

  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
          background-color: ${theme.bodyBg}; 
          color: ${theme.textColor}; 
          margin: 0; 
          padding: 0; 
          -webkit-font-smoothing: antialiased; 
        }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .container { 
          background-color: ${theme.containerBg}; 
          border: 1px solid ${theme.containerBorder}; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: ${isBusiness ? '0 20px 50px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)'}; 
        }
        .header { 
          padding: 36px 24px 24px 24px; 
          text-align: center; 
          border-bottom: 1px solid ${theme.containerBorder}; 
          background-color: ${theme.headerBg}; 
        }
        .logo { 
          height: 32px; 
          width: auto; 
          object-fit: contain; 
          ${isBusiness ? 'filter: brightness(0) invert(1);' : ''} 
        }
        .content { padding: 36px 36px; }
        .title { font-size: 24px; font-weight: 800; color: ${theme.textColor}; margin: 0 0 8px 0; letter-spacing: -0.02em; }
        .subtitle { font-size: 14px; color: ${theme.textMuted}; margin: 0 0 28px 0; line-height: 1.6; }
        .section-label { 
          font-size: 11px; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.15em; 
          color: ${theme.labelColor}; 
          margin-bottom: 12px; 
        }
        
        /* Cajas Informativas generales */
        .info-card {
          background-color: ${theme.cardBg};
          border: 1px solid ${theme.cardBorder};
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 24px;
        }

        /* Estilos de Ticket de compra */
        .ticket-box { 
          background-color: ${theme.cardBg}; 
          border-radius: 18px; 
          border: 1px solid ${theme.cardBorder}; 
          padding: 22px; 
          margin-bottom: 28px; 
        }
        .ticket-row { 
          display: table; 
          width: 100%; 
          margin-bottom: 12px; 
          padding-bottom: 12px; 
          border-bottom: 1px dashed ${theme.dashedBorder}; 
        }
        .ticket-row:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
        .item-name { display: table-cell; font-size: 14px; color: ${theme.textColor}; font-weight: 500; }
        .item-qty { 
          display: inline-block;
          font-size: 11px; 
          font-weight: 700;
          color: ${theme.badgeText}; 
          background-color: ${theme.badgeBg};
          padding: 2px 8px;
          border-radius: 12px;
          margin-left: 6px; 
        }
        .item-price { display: table-cell; text-align: right; font-size: 14px; color: ${theme.textColor}; font-weight: 600; }
        
        .total-box { 
          margin-top: 16px; 
          padding-top: 16px; 
          border-top: 2px solid ${theme.accentColor}; 
        }
        .total-label { font-size: 14px; font-weight: 800; color: ${theme.totalLabelColor}; text-transform: uppercase; letter-spacing: 0.05em; }
        .total-amount { font-size: 22px; font-weight: 800; color: ${theme.totalAmountColor}; text-align: right; }
        
        .grid { display: table; width: 100%; table-layout: fixed; }
        .col { display: table-cell; width: 50%; vertical-align: top; }
        .info-label { 
          font-size: 10px; 
          font-weight: 700; 
          text-transform: uppercase; 
          color: ${theme.labelColor}; 
          letter-spacing: 0.1em; 
          margin-bottom: 4px; 
        }
        .info-value { font-size: 13px; color: ${theme.textColor}; line-height: 1.5; padding-right: 10px; }
        
        .meta-box { 
          font-size: 13px; 
          color: ${theme.textColor}; 
          background-color: ${theme.cardBg}; 
          padding: 16px 20px; 
          border-radius: 16px; 
          border-left: 4px solid ${theme.accentColor}; 
          border-top: 1px solid ${theme.cardBorder};
          border-right: 1px solid ${theme.cardBorder};
          border-bottom: 1px solid ${theme.cardBorder};
          margin-bottom: 28px; 
        }
        .footer { 
          text-align: center; 
          padding: 28px; 
          font-size: 12px; 
          color: ${theme.textMuted}; 
          border-top: 1px solid ${theme.cardBorder}; 
          background-color: ${theme.footerBg}; 
        }
        .footer a { color: ${theme.footerLink}; text-decoration: none; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          
          <!-- Header Logo -->
          <div class="header">
            <img src="${BRAND_LOGO}" alt="${BRAND_NAME}" class="logo" />
          </div>

          <!-- Body Content -->
          <div class="content">
            <h1 class="title">${title}</h1>
            <p class="subtitle">${subtitle}</p>

            <!-- Datos Generales de la Transacción -->
            <div class="info-card">
              <div class="grid">
                <div class="col">
                  <div class="info-label">${t("labels.orderId")}</div>
                  <div class="info-value" style="font-family: monospace; font-size: 14px; font-weight: 700; color: ${theme.accentColor};">${orderId}</div>
                </div>
                <div class="col">
                  <div class="info-label">${t("labels.paymentDate")}</div>
                  <div class="info-value">${new Date().toLocaleDateString(t("localeCode") === "en" ? "en-US" : "es-MX", { timeZone: "America/Mexico_City" })}</div>
                </div>
              </div>
            </div>

            <!-- Detalles del Cliente & Envío -->
            <div class="section-label">${isBusiness ? t("labels.buyerInfo") : t("labels.billingDetails")}</div>
            <div class="info-card">
              <div class="grid">
                <div class="col">
                  <div class="info-label">${t("labels.customer")}</div>
                  <div class="info-value">
                    <strong>${customer.nombre} ${customer.apellido}</strong><br/>
                    ${customer.email}<br/>
                    ${customer.telefono}
                  </div>
                </div>
                <div class="col">
                  <div class="info-label">${t("labels.address")}</div>
                  <div class="info-value">
                    ${customer.direccion}<br/>
                    ${customer.direccion2 ? customer.direccion2 + '<br/>' : ''}
                    ${customer.ciudad}, ${customer.estado}<br/>
                    CP: ${customer.cp}, ${customer.pais}
                    ${customer.empresa ? `<br/><strong>${t("labels.company")}:</strong> ` + customer.empresa : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Notas o Metadata del Cupón -->
            ${metadata && (metadata.notes || Object.keys(metadata).length > 0) ? `
              <div class="section-label">${t("labels.operationDetails")}</div>
              <div class="meta-box">
                ${metadata.notes || JSON.stringify(metadata)}
              </div>
            ` : ''}

            <!-- Desglose de Productos (Ticket) -->
            <div class="section-label">${t("labels.modulesSummary")}</div>
            <div class="ticket-box">
              ${items.map((item: any) => `
                <div class="ticket-row">
                  <div class="item-name">
                    ${item.product.name}
                    <span class="item-qty">x${item.quantity || 1}</span>
                  </div>
                  <div class="item-price">
                    $${(Number(item.product.price) * (item.quantity || 1)).toFixed(2)} MXN
                  </div>
                </div>
              `).join('')}
              
              <!-- Total -->
              <div class="ticket-row total-box">
                <div class="item-name total-label">${t("labels.totalPaid")}</div>
                <div class="item-price total-amount">$${amount.toFixed(2)} MXN</div>
              </div>
            </div>

          </div>

          <!-- Footer Legal -->
          <div class="footer">
            ${t("footer.copyright", { year: currentYear, brandName: BRAND_NAME })
              .replace(BRAND_NAME, `<a href="${BRAND_URL}">${BRAND_NAME}</a>`)}<br/>
            ${t("footer.specialty")}
          </div>

        </div>
      </div>
    </body>
    </html>
  `;
}