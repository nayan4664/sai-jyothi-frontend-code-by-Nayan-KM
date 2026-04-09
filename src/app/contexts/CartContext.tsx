import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { cartApi, type CartItem as PersistedCartItem } from '../lib/cart-api';
import type { Book } from '../types/book';

interface CartItem extends Book {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => Promise<void>;
  removeFromCart: (bookId: number) => Promise<void>;
  updateQuantity: (bookId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.author === 'string' &&
    typeof item.price === 'number' &&
    typeof item.category === 'string' &&
    typeof item.rating === 'number' &&
    typeof item.image === 'string' &&
    typeof item.description === 'string' &&
    typeof item.isbn === 'string' &&
    typeof item.pages === 'number' &&
    typeof item.publisher === 'string' &&
    typeof item.language === 'string' &&
    typeof item.quantity === 'number'
  );
};

const getGuestCartStorageKey = () => 'cart:guest';

const toCartItems = (items: PersistedCartItem[]): CartItem[] =>
  items.map(({ lineTotal: _lineTotal, ...item }) => item);

const readGuestCart = (): CartItem[] => {
  const savedCart = localStorage.getItem(getGuestCartStorageKey());
  if (!savedCart) {
    return [];
  }

  try {
    const parsedCart: unknown = JSON.parse(savedCart);
    if (Array.isArray(parsedCart) && parsedCart.every(isCartItem)) {
      return parsedCart;
    }
  } catch {
    // Fall through to cleanup.
  }

  localStorage.removeItem(getGuestCartStorageKey());
  return [];
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, authToken } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartReady, setIsCartReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadCart = async () => {
      setIsCartReady(false);

      if (user && authToken) {
        try {
          const guestCart = readGuestCart();
          let response = await cartApi.getCart(authToken);

          if (guestCart.length > 0) {
            const mergedQuantities = new Map<number, number>();

            for (const item of response.items) {
              mergedQuantities.set(item.id, item.quantity);
            }

            for (const guestItem of guestCart) {
              mergedQuantities.set(
                guestItem.id,
                (mergedQuantities.get(guestItem.id) ?? 0) + guestItem.quantity
              );
            }

            for (const [bookId, quantity] of mergedQuantities) {
              response = await cartApi.addOrUpdateItem(authToken, bookId, quantity);
            }

            localStorage.removeItem(getGuestCartStorageKey());
          }

          if (isActive) {
            setCart(toCartItems(response.items));
          }
        } catch {
          if (isActive) {
            setCart([]);
          }
        } finally {
          if (isActive) {
            setIsCartReady(true);
          }
        }
        return;
      }

      if (isActive) {
        setCart(readGuestCart());
        setIsCartReady(true);
      }
    };

    void loadCart();

    return () => {
      isActive = false;
    };
  }, [authToken, user]);

  useEffect(() => {
    if (!isCartReady || (user && authToken)) {
      return;
    }

    localStorage.setItem(getGuestCartStorageKey(), JSON.stringify(cart));
  }, [authToken, cart, isCartReady, user]);

  const addToCart = async (book: Book) => {
    if (user && authToken) {
      const existingItem = cart.find((item) => item.id === book.id);
      const nextQuantity = existingItem ? existingItem.quantity + 1 : 1;
      const response = await cartApi.addOrUpdateItem(authToken, book.id, nextQuantity);
      setCart(toCartItems(response.items));
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = async (bookId: number) => {
    if (user && authToken) {
      const response = await cartApi.removeItem(authToken, bookId);
      setCart(toCartItems(response.items));
      return;
    }

    setCart((prevCart) => prevCart.filter((item) => item.id !== bookId));
  };

  const updateQuantity = async (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(bookId);
      return;
    }

    if (user && authToken) {
      const response = await cartApi.addOrUpdateItem(authToken, bookId, quantity);
      setCart(toCartItems(response.items));
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === bookId ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (user && authToken) {
      await cartApi.clearCart(authToken);
    }

    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartReady,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
