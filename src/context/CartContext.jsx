import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Persist cart
    const saved = localStorage.getItem('nearbuy_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nearbuy_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
            // Optional: Increment quantity if suitable for used items, 
            // but usually used items are unique. Let's assume quantity 1 for now.
            return prev;
        }
        return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
