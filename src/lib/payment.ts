'use server';

import axios from 'axios';

export interface PaymentData {
    amount: number;
    orderId: string;
    currency?: string;

    cardData: {
        number: string;
        name: string;
        month: string;
        year: string;
        cvv: string;
    };

    customer: {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        direccion: string;
        direccion2?: string;
        ciudad: string;
        estado: string;
        pais?: string;
        cp: string;
        empresa?: string;
    };

    metadata?: {
        ip?: string;
        deviceId?: string;
        notes?: string;
    };
}

const API_URL = "https://pagos.etomin.com/api/v1";

// Instancia global con los headers base que exige Etomin
const etominClient = axios.create({
    baseURL: API_URL,
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    },
});

async function getAuthToken(): Promise<string> {
    const { data } = await etominClient.post('/signin', {
        email: process.env.ETOMIN_USER,
        password: process.env.ETOMIN_PASSWORD,
    });

    return data.authToken;
}

async function tokenizeCard(token: string, payment: PaymentData): Promise<string> {
    const card = payment.cardData;

    const { data } = await etominClient.post(
        '/card/tokenizer',
        {
            cardData: {
                cardNumber: card.number.replace(/\s/g, ''), // Limpiar espacios
                cardholderName: card.name,
                expirationYear: card.year,
                expirationMonth: card.month,
            },
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return data.cardNumberToken;
}

export async function processEtominPayment(payment: PaymentData) {
    try {
        // 1. Autenticación
        const authToken = await getAuthToken();

        // 2. Tokenización de la tarjeta (Sin el CVV)
        const cardToken = await tokenizeCard(authToken, payment);
        const currency = (payment.currency || "MXN").toUpperCase();
        const currencyCode = currency === "USD" ? "840" : "484";

        // 3. Ejecución de la Venta
        const salePayload = {
            amount: Number(payment.amount),
            currency: currencyCode,
            reference: payment.orderId,

            customerInformation: {
                firstName: payment.customer.nombre,
                lastName: payment.customer.apellido,
                email: payment.customer.email,
                phone1: payment.customer.telefono,
                address1: payment.customer.direccion,
                address2: payment.customer.direccion2 || "",
                city: payment.customer.ciudad,
                state: payment.customer.estado,
                postalCode: payment.customer.cp,
                country: payment.customer.pais || "MX",
                company: payment.customer.empresa || "",
                ip: payment.metadata?.ip || "127.0.0.1",
            },

            cardData: {
                cardNumberToken: cardToken,
                cvv: payment.cardData.cvv,
            },
        };

        const { data } = await etominClient.post('/sale', salePayload, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        // Validamos el estatus de forma insensible a mayúsculas/minúsculas ("approved" / "APPROVED")
        const isApproved = data.status?.toUpperCase() === "APPROVED";

        return {
            success: isApproved,
            orderId: data.orderId,
            reference: data.reference,
            transactionId: data.transactionId,
            status: data.status,
            data: data,
        };

    } catch (error: any) {
        console.error("Etomin Payment Error:", error.response?.data || error.message);
        return {
            success: false,
            status: "error",
            error: error.response?.data?.message || "Error procesando el pago con Etomin",
        };
    }
}