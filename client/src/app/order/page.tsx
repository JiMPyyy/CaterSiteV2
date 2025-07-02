'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, OrderItem, CreateOrderData } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

// Restaurant menu data
const restaurantMenus = {
  "capriottis": {
    name: "Capriotti's Sandwich Shop",
    items: [
      {
        id: 'cap1',
        name: 'The Bobbie',
        description: 'Turkey, cranberry sauce, stuffing, and mayo on a fresh roll',
        price: 12.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://www.reviewjournal.com/wp-content/uploads/2017/11/9548937_web1_capriotti-s_bobbie.jpeg'
      },
      {
        id: 'cap2',
        name: 'Italian Sub',
        description: 'Ham, salami, capicola, provolone, lettuce, tomato, onion, oil & vinegar',
        price: 11.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/italian-sub.jpg'
      },
      {
        id: 'cap3',
        name: 'Cheese Steak',
        description: 'Grilled steak with melted cheese, onions, and peppers',
        price: 13.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/cheese-steak.jpg'
      },
      {
        id: 'cap4',
        name: 'Veggie Sub',
        description: 'Fresh vegetables, cheese, lettuce, tomato, and Italian dressing',
        price: 9.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/veggie-sub.jpg'
      },
      {
        id: 'cap5',
        name: 'Chocolate Chip Cookie',
        description: 'Fresh baked chocolate chip cookie',
        price: 2.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/cookie.jpg'
      },
      {
        id: 'cap6',
        name: 'Fountain Drink',
        description: 'Choice of Coke, Pepsi, Sprite, or other sodas',
        price: 2.49,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: '/menu/soda.jpg'
      }
    ]
  },
  "sushi": {
    name: "Sushi on Demand",
    items: [
      {
        id: 'sushi1',
        name: 'California Roll',
        description: 'Crab, avocado, cucumber with sesame seeds',
        price: 8.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/california-roll.jpg'
      },
      {
        id: 'sushi2',
        name: 'Salmon Nigiri (2 pieces)',
        description: 'Fresh salmon over seasoned sushi rice',
        price: 6.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/salmon-nigiri.jpg'
      },
      {
        id: 'sushi3',
        name: 'Spicy Tuna Roll',
        description: 'Spicy tuna with cucumber and spicy mayo',
        price: 9.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/spicy-tuna.jpg'
      },
      {
        id: 'sushi4',
        name: 'Vegetable Roll',
        description: 'Cucumber, avocado, carrot, and lettuce',
        price: 7.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: '/menu/veggie-roll.jpg'
      },
      {
        id: 'sushi5',
        name: 'Mochi Ice Cream',
        description: 'Sweet rice cake filled with ice cream (3 pieces)',
        price: 5.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/mochi.jpg'
      },
      {
        id: 'sushi6',
        name: 'Green Tea',
        description: 'Hot or iced traditional Japanese green tea',
        price: 2.99,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: '/menu/green-tea.jpg'
      }
    ]
  },
  "pizza": {
    name: "Pizza Place",
    items: [
      {
        id: 'pizza1',
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, basil on thin crust',
        price: 14.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/margherita.jpg'
      },
      {
        id: 'pizza2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese and tomato sauce',
        price: 16.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/pepperoni.jpg'
      },
      {
        id: 'pizza3',
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, peppers, onions, mushrooms, olives',
        price: 19.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/supreme.jpg'
      },
      {
        id: 'pizza4',
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
        price: 8.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/caesar-salad.jpg'
      },
      {
        id: 'pizza5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 6.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/tiramisu.jpg'
      },
      {
        id: 'pizza6',
        name: 'Italian Soda',
        description: 'Sparkling water with Italian syrup flavors',
        price: 3.49,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: '/menu/italian-soda.jpg'
      }
    ]
  }
};

interface CartItem extends OrderItem {
  id: string;
}

export default function OrderPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<keyof typeof restaurantMenus>('capriottis');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
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

  // Pre-fill date from URL parameter if coming from schedule page
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setDeliveryInfo(prev => ({
        ...prev,
        date: dateParam
      }));
    }
  }, [searchParams]);

  // Get current menu items based on selected restaurant
  const currentMenu = restaurantMenus[selectedRestaurant].items;

  // Add item to cart
  const addToCart = (menuItem: typeof currentMenu[0]) => {
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

  // Handle payment success
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment success received:', paymentId);
    setPaymentIntentId(paymentId);
    setShowPayment(false);
    // Now create the order with payment
    createOrderWithPayment(paymentId);
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.log('Payment error received:', error);
    setErrorMessage(`Payment failed: ${error}`);
    setShowErrorModal(true);
    setIsSubmitting(false);
  };

  // Create order with payment
  const createOrderWithPayment = async (paymentId: string) => {
    try {
      console.log('Creating order with payment ID:', paymentId);
      const orderData: CreateOrderData & { paymentIntentId: string } = {
        items: cart.map(({ id, ...item }) => item),
        deliveryDate: deliveryInfo.date,
        deliveryTime: deliveryInfo.time,
        deliveryAddress: deliveryInfo.address,
        specialInstructions: deliveryInfo.specialInstructions,
        paymentIntentId: paymentId
      };

      console.log('Order data:', orderData);
      const result = await orderService.createOrder(orderData);
      console.log('Order creation result:', result);

      setOrderSuccess(true);
      setCart([]);
      setDeliveryInfo({
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
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      setErrorMessage(error.message || 'Failed to create order');
      setShowErrorModal(true);
      setIsSubmitting(false);
    }
  };

  // Handle order submission (now shows payment form)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage('Please log in to place an order');
      setShowErrorModal(true);
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Please add items to your cart');
      setShowErrorModal(true);
      return;
    }

    // Check if delivery time is within 12 hours
    const deliveryDateTime = new Date(`${deliveryInfo.date}T${deliveryInfo.time}`);
    const currentTime = new Date();
    const timeDifference = deliveryDateTime.getTime() - currentTime.getTime();
    const hoursUntilDelivery = timeDifference / (1000 * 60 * 60); // Convert to hours

    if (hoursUntilDelivery < 12) {
      setErrorMessage('Orders must be placed at least 12 hours in advance. Please select a delivery time that is at least 12 hours from now to allow proper preparation time.');
      setShowErrorModal(true);
      return;
    }

    // Show payment form instead of creating order directly
    setShowPayment(true);
    // Don't set isSubmitting here - let the payment form handle its own processing state
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
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition"
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

        {/* Restaurant Selection Dropdown */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Choose Restaurant:
          </label>
          <select
            value={selectedRestaurant}
            onChange={(e) => {
              setSelectedRestaurant(e.target.value as keyof typeof restaurantMenus);
              setCart([]); // Clear cart when switching restaurants
            }}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
          >
            <option value="capriottis">Capriotti's Sandwich Shop</option>
            <option value="sushi">Sushi on Demand</option>
            <option value="pizza">Pizza Place</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Dishes */}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Main Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMenu.filter(item => item.category === 'main').map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {item.image && (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
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
                              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desserts */}
            {currentMenu.filter(item => item.category === 'dessert').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Desserts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMenu.filter(item => item.category === 'dessert').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {item.image && (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
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
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                              >
                                <Plus size={16} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Beverages */}
            {currentMenu.filter(item => item.category === 'beverage').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-4">Beverages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentMenu.filter(item => item.category === 'beverage').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {item.image && (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
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
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                              >
                                <Plus size={16} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
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
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Delivery Information Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar size={16} />
                      Delivery Details
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={deliveryInfo.date}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, date: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          value={deliveryInfo.time}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, time: e.target.value})}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <MapPin size={14} />
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={deliveryInfo.address.street}
                        onChange={(e) => setDeliveryInfo({
                          ...deliveryInfo,
                          address: {...deliveryInfo.address, street: e.target.value}
                        })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-2"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={deliveryInfo.address.city}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, city: e.target.value}
                          })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={deliveryInfo.address.zipCode}
                          onChange={(e) => setDeliveryInfo({
                            ...deliveryInfo,
                            address: {...deliveryInfo.address, zipCode: e.target.value}
                          })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        placeholder="Any special delivery instructions..."
                        value={deliveryInfo.specialInstructions}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        rows={3}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <StripePaymentForm
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isProcessing={isSubmitting}
                  setIsProcessing={setIsSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Place Order</h3>
                <p className="text-gray-600 mb-6">{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
