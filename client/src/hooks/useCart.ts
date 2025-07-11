import { useState } from 'react';
import { OrderItem } from '@/lib/services/orders';

export interface CartItem extends OrderItem {
  id: string;
  image?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add item to cart
  const addToCart = (menuItem: any) => {
    const existingItem = cart.find(item => item.id === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const cartItem = {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        quantity: 1,
        price: menuItem.price,
        category: menuItem.category,
        dietaryInfo: menuItem.dietaryInfo as any
      };
      setCart([...cart, cartItem]);
    }
  };

  // Add item to cart with specific quantity
  const addToCartWithQuantity = (menuItem: any, quantity: number) => {
    if (quantity <= 0) return;

    const existingItem = cart.find(item => item.id === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        quantity: quantity,
        price: menuItem.price,
        category: menuItem.category,
        dietaryInfo: menuItem.dietaryInfo as any
      }]);
    }
  };

  // Add custom item to cart (for modals that create custom items)
  const addCustomItemToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  // Remove item from cart (decrement quantity or remove completely)
  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== itemId));
    }
  };

  // Add item from cart (increment quantity)
  const addItemFromCart = (cartItem: CartItem) => {
    setCart(cart.map(item =>
      item.id === cartItem.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Update cart item quantity directly
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  return {
    cart,
    setCart,
    addToCart,
    addToCartWithQuantity,
    addCustomItemToCart,
    removeFromCart,
    addItemFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    updateCartItemQuantity
  };
};
