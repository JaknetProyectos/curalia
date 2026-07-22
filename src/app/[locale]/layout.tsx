import LangSwitcher from '@/components/LangSwitcher';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LocaleProvider } from '@/context/LangContext';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/context/CartContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { Toaster } from 'sonner';
import ClientBody from './ClientBody';


export default async function LocaleLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Validación inicial de locale
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <ClientBody>
                <LocaleProvider>
                    <CartProvider>
                        <Header />
                        {children}
                        <Footer />
                        <LangSwitcher />
                        <Toaster />
                    </CartProvider>
                </LocaleProvider>
            </ClientBody>
        </NextIntlClientProvider>
    );
}