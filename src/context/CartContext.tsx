"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart-item";

interface CartContextType {
    items: CartItem[];

    // productos distintos en el carrito
    itemCount: number;

    // unidades totales sumando quantity
    totalQuantity: number;

    total: number;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "medconfianza_cart";

function normalizeCartItems(items: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    for (const item of items) {
        const existing = map.get(item.product.id);

        if (existing) {
            map.set(item.product.id, {
                ...existing,
                quantity: existing.quantity + item.quantity,
            });
        } else {
            map.set(item.product.id, item);
        }
    }

    return Array.from(map.values());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (savedCart) {
                const parsed = JSON.parse(savedCart) as CartItem[];
                setItems(normalizeCartItems(parsed));
            }
        } catch (error) {
            console.error("Error loading cart from storage:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Error saving cart to storage:", error);
        }
    }, [items, isLoaded]);

    const addItem = useCallback((product: Product, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { product, quantity }];
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.product.id !== productId)
        );
    }, []);

    const updateQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (quantity <= 0) {
                removeItem(productId);
                return;
            }

            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                )
            );
        },
        [removeItem]
    );

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const isInCart = useCallback(
        (productId: string) => {
            return items.some((item) => item.product.id === productId);
        },
        [items]
    );

    const getItemQuantity = useCallback(
        (productId: string) => {
            const item = items.find((item) => item.product.id === productId);
            return item?.quantity ?? 0;
        },
        [items]
    );

    const itemCount = useMemo(() => items.length, [items]);

    const totalQuantity = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const total = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            ),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            itemCount,
            totalQuantity,
            total,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isInCart,
            getItemQuantity,
        }),
        [
            items,
            itemCount,
            totalQuantity,
            total,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isInCart,
            getItemQuantity,
        ]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart debe ser utilizado estrictamente dentro de un CartProvider");
    }
    return context;
}