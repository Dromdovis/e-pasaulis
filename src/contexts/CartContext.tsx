import { createContext, useContext, useEffect, useState } from 'react';
import { CartManager } from '../lib/patterns/singleton';
import { CartItem, AddToCartCommand } from '../lib/patterns/command';
import { Product } from '../types';

interface CartContextType {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  cartItems: CartItem[];
  undoLastAction: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartManager = CartManager.getInstance();
  const cart = cartManager.getCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<AddToCartCommand[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    const item = new CartItem(product.id, quantity, product.price);
    const command = new AddToCartCommand(cart, item);
    
    command.execute();
    setCommandHistory(prev => [...prev, command]);
    setItems(cart.getItems());
  };

  const undoLastAction = () => {
    const lastCommand = commandHistory[commandHistory.length - 1];
    if (lastCommand) {
      lastCommand.undo();
      setCommandHistory(prev => prev.slice(0, -1));
      setItems(cart.getItems());
    }
  };

  const removeFromCart = (productId: string) => {
    cart.removeItem(productId);
    setItems(cart.getItems());
  };

  return (
    <CartContext.Provider value={{ addToCart, removeFromCart, cartItems: items, undoLastAction }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 