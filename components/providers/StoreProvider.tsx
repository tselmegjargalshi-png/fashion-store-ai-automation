"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { CartItem, Product, Size } from "@/lib/types";
import { createId, lineIdFor } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Cart + wishlist state, persisted to localStorage.
 * Shaped so it can later be backed by a commerce API without
 * changing component code: components only use the hook below.
 * ────────────────────────────────────────────────────────────── */

interface StoreState {
  cartId: string;
  items: CartItem[];
  wishlist: string[]; // product ids
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; state: Partial<StoreState> }
  | { type: "add"; item: CartItem }
  | { type: "setQty"; lineId: string; quantity: number }
  | { type: "remove"; lineId: string }
  | { type: "clear" }
  | { type: "toggleWish"; productId: string };

const MAX_QTY = 10;
const STORAGE_KEY = "elora:store:v1";

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.state, hydrated: true };
    case "add": {
      const existing = state.items.find((i) => i.lineId === action.item.lineId);
      const items = existing
        ? state.items.map((i) =>
            i.lineId === action.item.lineId ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + action.item.quantity) } : i,
          )
        : [...state.items, action.item];
      return { ...state, items };
    }
    case "setQty":
      return {
        ...state,
        items: state.items
          .map((i) => (i.lineId === action.lineId ? { ...i, quantity: Math.max(0, Math.min(MAX_QTY, action.quantity)) } : i))
          .filter((i) => i.quantity > 0),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.lineId !== action.lineId) };
    case "clear":
      return { ...state, items: [], cartId: createId("cart") };
    case "toggleWish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.productId)
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
  }
}

interface Toast {
  id: number;
  message: string;
  action?: { label: string; href: string };
}

interface StoreContextValue {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  wishlist: string[];
  hydrated: boolean;
  addToCart: (product: Product, options: { color: string; size: Size; quantity?: number }, opts?: { openDrawer?: boolean }) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  // UI
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toast: Toast | null;
  notify: (message: string, action?: Toast["action"]) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { cartId: "", items: [], wishlist: [], hydrated: false });
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from storage after mount (avoids SSR mismatch).
  useEffect(() => {
    let saved: Partial<StoreState> = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      /* storage unavailable or corrupted — start fresh */
    }
    dispatch({
      type: "hydrate",
      state: {
        cartId: saved.cartId || createId("cart"),
        items: Array.isArray(saved.items) ? saved.items : [],
        wishlist: Array.isArray(saved.wishlist) ? saved.wishlist : [],
      },
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cartId: state.cartId, items: state.items, wishlist: state.wishlist }));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [state]);

  const notify = useCallback((message: string, action?: Toast["action"]) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, action });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const addToCart = useCallback<StoreContextValue["addToCart"]>(
    (product, { color, size, quantity = 1 }, opts = { openDrawer: true }) => {
      dispatch({
        type: "add",
        item: {
          lineId: lineIdFor(product.id, color, size),
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          color,
          size,
          unitPrice: product.price,
          quantity,
        },
      });
      if (opts.openDrawer) setCartOpen(true);
      else notify(`${product.name} added to your bag`, { label: "View bag", href: "/cart" });
    },
    [notify],
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      const adding = !state.wishlist.includes(product.id);
      dispatch({ type: "toggleWish", productId: product.id });
      notify(adding ? `Saved ${product.name} to your wishlist` : `Removed ${product.name} from your wishlist`, adding ? { label: "View", href: "/wishlist" } : undefined);
    },
    [state.wishlist, notify],
  );

  const value = useMemo<StoreContextValue>(() => {
    const itemCount = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = state.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    return {
      cartId: state.cartId,
      items: state.items,
      itemCount,
      subtotal,
      wishlist: state.wishlist,
      hydrated: state.hydrated,
      addToCart,
      setQuantity: (lineId, quantity) => dispatch({ type: "setQty", lineId, quantity }),
      removeItem: (lineId) => dispatch({ type: "remove", lineId }),
      clearCart: () => dispatch({ type: "clear" }),
      toggleWishlist,
      isWishlisted: (id) => state.wishlist.includes(id),
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      toast,
      notify,
    };
  }, [state, addToCart, toggleWishlist, cartOpen, searchOpen, toast, notify]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
