'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, OrderItem, CreateOrderData } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';

// Sample menu data (in a real app, this would come from an API)
const menuItems = [
  {
    id: '1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing, parmesan cheese, and croutons',
    price: 12.99,
    category: 'main' as const,
    dietaryInfo: ['vegetarian'],
    image: '/menu/caesar-salad.jpg'
  },
  {
    id: '2',
    name: 'Grilled Chicken Sandwich',
    description: 'Grilled chicken breast with avocado, lettuce, tomato on artisan bread',
    price: 15.99,
    category: 'main' as const,
    dietaryInfo: [],
    image: '/menu/chicken-sandwich.jpg'
  },
  {
    id: '3',
    name: 'Vegetarian Wrap',
    description: 'Hummus, roasted vegetables, spinach, and feta cheese in a whole wheat wrap',
    price: 11.99,
    category: 'main' as const,
    dietaryInfo: ['vegetarian'],
    image: '/menu/veggie-wrap.jpg'
  },
  {
    id: '4',
    name: 'BBQ Pulled Pork',
    description: 'Slow-cooked pulled pork with BBQ sauce, coleslaw, and pickles',
    price: 16.99,
    category: 'main' as const,
    dietaryInfo: [],
    image: '/menu/bbq-pork.jpg'
  },
  {
    id: '5',
    name: 'Quinoa Power Bowl',
    description: 'Quinoa with roasted vegetables, chickpeas, and tahini dressing',
    price: 13.99,
    category: 'main' as const,
    dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
    image: '/menu/quinoa-bowl.jpg'
  },
  {
    id: '6',
    name: 'Fish Tacos',
    description: 'Grilled fish with cabbage slaw, pico de gallo, and lime crema',
    price: 14.99,
    category: 'main' as const,
    dietaryInfo: [],
    image: '/menu/fish-tacos.jpg'
  },
  {
    id: '7',
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream',
    price: 6.99,
    category: 'dessert' as const,
    dietaryInfo: ['vegetarian'],
    image: '/menu/brownie.jpg'
  },
  {
    id: '8',
    name: 'Fresh Fruit Salad',
    description: 'Seasonal fresh fruits with honey-lime dressing',
    price: 5.99,
    category: 'dessert' as const,
    dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
    image: '/menu/fruit-salad.jpg'
  },
  {
    id: '9',
    name: 'Sparkling Water',
    description: 'Premium sparkling water with natural flavors',
    price: 2.99,
    category: 'beverage' as const,
    dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
    image: '/menu/sparkling-water.jpg'
  },
  {
    id: '10',
    name: 'Fresh Juice',
    description: 'Freshly squeezed orange, apple, or cranberry juice',
    price: 3.99,
    category: 'beverage' as const,
    dietaryInfo: ['vegetarian', 'vegan', 'gluten-free'],
    image: '/menu/fresh-juice.jpg'
  }
];

interface CartItem extends OrderItem {
  id: string;
}

export default function OrderPage() {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    date: '',
    time: '',
    address: {
      street: '',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: ''
    },
    specialInstructions: ''
  });

  // Add item to cart
  const addToCart = (menuItem: typeof menuItems[0]) => {
    const existingItem = cart.find(item => item.id === menuItem.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        quantity: 1,
        price: menuItem.price,
        category: menuItem.category,
        dietaryInfo: menuItem.dietaryInfo as any
      }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please log in to place an order');
      return;
    }

    if (cart.length === 0) {
      alert('Please add items to your cart');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData: CreateOrderData = {
        items: cart.map(({ id, ...item }) => item), // Remove id field
        deliveryDate: deliveryInfo.date,
        deliveryTime: deliveryInfo.time,
        deliveryAddress: deliveryInfo.address,
        specialInstructions: deliveryInfo.specialInstructions
      };

      await orderService.createOrder(orderData);
      setOrderSuccess(true);
      setCart([]);
      setDeliveryInfo({
        date: '',
        time: '',
        address: { street: '', city: 'Las Vegas', state: 'NV', zipCode: '' },
        specialInstructions: ''
      });
    } catch (error: any) {
      alert(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md"
        >
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Thank you for your order. We'll prepare it with care and deliver it on time.</p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Place Another Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Food</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Menu</h2>

            {/* Main Dishes */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Main Dishes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.filter(item => item.category === 'main').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <span className="text-lg font-bold text-blue-600">${item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                    {/* Dietary Info */}
                    {item.dietaryInfo.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.dietaryInfo.map((info) => (
                          <span key={info} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {info}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {cart.find(cartItem => cartItem.id === item.id) ? (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-medium">
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desserts */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Desserts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.filter(item => item.category === 'dessert').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <span className="text-lg font-bold text-blue-600">${item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                    {/* Dietary Info */}
                    {item.dietaryInfo.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.dietaryInfo.map((info) => (
                          <span key={info} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {info}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {cart.find(cartItem => cartItem.id === item.id) ? (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-medium">
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Beverages */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Beverages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.filter(item => item.category === 'beverage').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <span className="text-lg font-bold text-blue-600">${item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                    {/* Dietary Info */}
                    {item.dietaryInfo.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.dietaryInfo.map((info) => (
                          <span key={info} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {info}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {cart.find(cartItem => cartItem.id === item.id) ? (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-medium">
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart and Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart size={20} />
                Your Order
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(menuItems.find(mi => mi.id === item.id)!)}
                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Information Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar size={16} />
                      Delivery Information
                    </h4>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={deliveryInfo.date}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          value={deliveryInfo.time}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, time: e.target.value})}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin size={14} />
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={deliveryInfo.address.street}
                        onChange={(e) => setDeliveryInfo({
                          ...deliveryInfo,
                          address: {...deliveryInfo.address, street: e.target.value}
                        })}
                        placeholder="123 Business Ave"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={deliveryInfo.address.city}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, city: e.target.value}
                          })}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                        <input
                          type="text"
                          value={deliveryInfo.address.zipCode}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, zipCode: e.target.value}
                          })}
                          placeholder="89101"
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        value={deliveryInfo.specialInstructions}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                        placeholder="Please deliver to reception desk..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !isAuthenticated}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isSubmitting ? 'Placing Order...' : !isAuthenticated ? 'Please Log In' : 'Place Order'}
                    </button>

                    {!isAuthenticated && (
                      <p className="text-sm text-gray-600 text-center">
                        Please log in to place an order
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}