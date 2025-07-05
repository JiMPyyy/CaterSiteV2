'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
import { orderService, OrderItem, CreateOrderData } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'dessert' | 'beverage';
  dietaryInfo: string[];
  image: string;
};

// Restaurant menu data
const restaurantMenus = {
  "capriottis": {
    name: "Capriotti's Sandwich Shop",
    items: [
      {
        id: 'cap1',
        name: 'The Bobbie® Party Tray',
        description: 'Our famous Bobbie sandwich cut into party portions. Serves 10-12 people.',
        price: 89.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://www.reviewjournal.com/wp-content/uploads/2019/11/12550314_web1_TheBobbie.jpg'
      },
      {
        id: 'cap2',
        name: 'Italian Sub Party Tray',
        description: 'Classic Italian sub with premium meats and cheese, cut for sharing. Serves 10-12 people.',
        price: 84.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/italian-sub.jpg'
      },
      {
        id: 'cap3',
        name: 'Cheese Steak Party Tray',
        description: 'Philly-style cheese steak with grilled onions and peppers. Serves 10-12 people.',
        price: 94.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/cheese-steak.jpg'
      },
      {
        id: 'cap4',
        name: 'Veggie Sub Party Tray',
        description: 'Fresh vegetables with cheese and Italian dressing. Serves 10-12 people.',
        price: 74.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/veggie-sub.jpg'
      },
      {
        id: 'cap5',
        name: 'Assorted Cookie Tray',
        description: 'Fresh baked cookies - chocolate chip, oatmeal raisin, and sugar cookies.',
        price: 24.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/cookie.jpg'
      },
      {
        id: 'cap6',
        name: 'Assorted Sodas (12-pack)',
        description: 'Variety pack of Coca-Cola products.',
        price: 18.99,
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
        description: 'Classic pepperoni with mozzarella cheese',
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
        name: 'Garlic Bread',
        description: 'Fresh baked bread with garlic butter and herbs',
        price: 6.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/garlic-bread.jpg'
      },
      {
        id: 'pizza5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 7.99,
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
  image?: string;
}

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [selectedRestaurant, setSelectedRestaurant] = useState<keyof typeof restaurantMenus>('capriottis');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!deliveryInfo.date || !deliveryInfo.time || !deliveryInfo.address.street || !deliveryInfo.address.city || !deliveryInfo.address.zipCode) {
      setErrorMessage('Please fill in all required delivery information.');
      setShowErrorModal(true);
      return;
    }

    // Check if delivery is at least 12 hours in advance
    const deliveryDateTime = new Date(`${deliveryInfo.date}T${deliveryInfo.time}`);
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    if (deliveryDateTime < twelveHoursFromNow) {
      setErrorMessage('Orders must be placed at least 12 hours in advance of the delivery time.');
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, just show success - payment integration would be implemented here
      alert('Order submitted successfully! (Payment integration would be implemented here)');
      setCart([]);
      setDeliveryInfo({
        date: '',
        time: '',
        address: { street: '', city: '', zipCode: '' },
        specialInstructions: ''
      });
    } catch (error) {
      setErrorMessage('Failed to submit order. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delivery information state
  const [deliveryInfo, setDeliveryInfo] = useState({
    date: '',
    time: '',
    address: {
      street: '',
      city: '',
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

  const currentMenu = restaurantMenus[selectedRestaurant].items;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

  // Handle restaurant selection with auto-scroll
  const handleRestaurantSelection = (restaurant: keyof typeof restaurantMenus) => {
    setSelectedRestaurant(restaurant);
    setCart([]); // Clear cart when switching restaurants

    // Smooth scroll to menu section after a brief delay
    setTimeout(() => {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300); // Small delay to allow state update
  };

  // Add item from cart (increment quantity)
  const addItemFromCart = (cartItem: CartItem) => {
    setCart(cart.map(item =>
      item.id === cartItem.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Order <span className="text-orange-500">Premium</span> Catering
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience exceptional catering from Las Vegas's finest restaurants
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <span className="ml-3 text-lg font-semibold text-white">Select Restaurant</span>
            </div>
            <div className="w-16 h-1 bg-orange-500 rounded"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                cart.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                2
              </div>
              <span className={`ml-3 text-lg font-semibold ${
                cart.length > 0 ? 'text-white' : 'text-gray-400'
              }`}>Build Your Order</span>
            </div>
            <div className={`w-16 h-1 rounded ${
              cart.length > 0 ? 'bg-orange-500' : 'bg-gray-600'
            }`}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                cart.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-400'
              }`}>
                3
              </div>
              <span className={`ml-3 text-lg font-semibold ${
                cart.length > 0 ? 'text-white' : 'text-gray-400'
              }`}>Complete Order</span>
            </div>
          </div>
        </div>

        {/* Step 1: Restaurant Selection */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Step 1: Choose Your <span className="text-orange-500">Restaurant</span>
            </h2>
            <p className="text-lg text-gray-300">Select from our curated collection of premium catering partners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Capriotti's Option */}
            <div
              onClick={() => handleRestaurantSelection('capriottis')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 ${
                selectedRestaurant === 'capriottis'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl'
                  : 'bg-gray-800 hover:shadow-xl border border-gray-700'
              }`}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  selectedRestaurant === 'capriottis'
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-red-500 to-red-600 group-hover:scale-110'
                }`}>
                  <span className={`text-3xl font-bold ${
                    selectedRestaurant === 'capriottis' ? 'text-white' : 'text-white'
                  }`}>🥪</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  selectedRestaurant === 'capriottis' ? 'text-white' : 'text-white'
                }`}>
                  Capriotti's
                </h3>
                <p className={`text-lg mb-4 ${
                  selectedRestaurant === 'capriottis' ? 'text-orange-100' : 'text-gray-300'
                }`}>
                  Sandwich Shop
                </p>
                <p className={`text-sm ${
                  selectedRestaurant === 'capriottis' ? 'text-orange-100' : 'text-gray-400'
                }`}>
                  Premium catering trays, box lunches & gourmet salads
                </p>
                {selectedRestaurant === 'capriottis' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-orange-600 text-lg font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sushi on Demand Option */}
            <div
              onClick={() => handleRestaurantSelection('sushi')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 ${
                selectedRestaurant === 'sushi'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl'
                  : 'bg-gray-800 hover:shadow-xl border border-gray-700'
              }`}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  selectedRestaurant === 'sushi'
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110'
                }`}>
                  <span className={`text-3xl font-bold ${
                    selectedRestaurant === 'sushi' ? 'text-white' : 'text-white'
                  }`}>🍣</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  selectedRestaurant === 'sushi' ? 'text-white' : 'text-white'
                }`}>
                  Sushi on Demand
                </h3>
                <p className={`text-lg mb-4 ${
                  selectedRestaurant === 'sushi' ? 'text-orange-100' : 'text-gray-300'
                }`}>
                  Japanese Cuisine
                </p>
                <p className={`text-sm ${
                  selectedRestaurant === 'sushi' ? 'text-orange-100' : 'text-gray-400'
                }`}>
                  Fresh sushi boats, custom platters & premium rolls
                </p>
                {selectedRestaurant === 'sushi' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-orange-600 text-lg font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pizza Place Option */}
            <div
              onClick={() => handleRestaurantSelection('pizza')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 ${
                selectedRestaurant === 'pizza'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl'
                  : 'bg-gray-800 hover:shadow-xl border border-gray-700'
              }`}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  selectedRestaurant === 'pizza'
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110'
                }`}>
                  <span className={`text-3xl font-bold ${
                    selectedRestaurant === 'pizza' ? 'text-white' : 'text-white'
                  }`}>🍕</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  selectedRestaurant === 'pizza' ? 'text-white' : 'text-white'
                }`}>
                  Pizza Place
                </h3>
                <p className={`text-lg mb-4 ${
                  selectedRestaurant === 'pizza' ? 'text-orange-100' : 'text-gray-300'
                }`}>
                  Italian Cuisine
                </p>
                <p className={`text-sm ${
                  selectedRestaurant === 'pizza' ? 'text-orange-100' : 'text-gray-400'
                }`}>
                  Artisan pizzas, appetizers & Italian desserts
                </p>
                {selectedRestaurant === 'pizza' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-orange-600 text-lg font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Menu Selection */}
        <div id="menu-section" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Step 2: Build Your <span className="text-orange-500">Order</span>
            </h2>
            <p className="text-lg text-gray-300">
              Explore the menu from <span className="font-semibold text-white">{restaurantMenus[selectedRestaurant].name}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Main Items Section */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4">
                    🍽️
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">Main Items</h3>
                    <p className="text-gray-300">Premium entrees and signature dishes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentMenu.filter(item => item.category === 'main').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700"
                    >
                      {item.image && (
                        <div className="h-56 w-full overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                            {item.name}
                          </h4>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>

                        {/* Dietary Info */}
                        {item.dietaryInfo.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.dietaryInfo.map((info) => (
                              <span key={info} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                {info}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <div className="flex items-center justify-between">
                          {cart.find(cartItem => cartItem.id === item.id) ? (
                            <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="text-lg font-bold text-white min-w-[2rem] text-center">
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-10 h-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                            >
                              <Plus size={20} />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desserts Section */}
              {currentMenu.filter(item => item.category === 'dessert').length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4">
                      🍰
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">Desserts & Treats</h3>
                      <p className="text-gray-300">Sweet endings to your perfect meal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentMenu.filter(item => item.category === 'dessert').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700"
                      >
                        {item.image && (
                          <div className="h-56 w-full overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                              {item.name}
                            </h4>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>

                          {/* Dietary Info */}
                          {item.dietaryInfo.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.dietaryInfo.map((info) => (
                                <span key={info} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                  {info}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Add to Cart Button */}
                          <div className="flex items-center justify-between">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold text-white min-w-[2rem] text-center">
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-10 h-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                              >
                                <Plus size={20} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beverages Section */}
              {currentMenu.filter(item => item.category === 'beverage').length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4">
                      🥤
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">Beverages</h3>
                      <p className="text-gray-300">Refreshing drinks to complement your meal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentMenu.filter(item => item.category === 'beverage').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700"
                      >
                        {item.image && (
                          <div className="h-56 w-full overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                              {item.name}
                            </h4>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>

                          {/* Dietary Info */}
                          {item.dietaryInfo.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.dietaryInfo.map((info) => (
                                <span key={info} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                  {info}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Add to Cart Button */}
                          <div className="flex items-center justify-between">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold text-white min-w-[2rem] text-center">
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-10 h-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center justify-center hover:scale-105"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                              >
                                <Plus size={20} />
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Cart and Checkout Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 sticky top-8">
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 ${
                    cart.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-600 text-gray-400'
                  }`}>
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Order</h3>
                    <p className="text-gray-300 text-sm">Review and complete</p>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg">Your cart is empty</p>
                    <p className="text-gray-500 text-sm mt-2">Add items from the menu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                            <span className="font-bold text-orange-500 text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-medium text-white min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => addItemFromCart(item)}
                                className="w-6 h-6 bg-orange-500 text-white rounded hover:bg-orange-600 transition flex items-center justify-center"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-xs text-gray-400">${item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-600 pt-4">
                      <div className="bg-orange-500/10 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Total:</span>
                          <span className="text-2xl font-bold text-orange-500">${total.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-600 pt-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Calendar size={16} />
                        Delivery Details
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                          <input
                            type="date"
                            value={deliveryInfo.date}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, date: e.target.value})}
                            className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                          <input
                            type="time"
                            value={deliveryInfo.time}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, time: e.target.value})}
                            className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
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
                          className="w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-2"
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
                            className="w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                            className="w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Special Instructions</label>
                        <textarea
                          placeholder="Any special delivery instructions..."
                          value={deliveryInfo.specialInstructions}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                          className="w-full border border-gray-600 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          rows={2}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Unable to Place Order</h3>
                <p className="text-gray-300 mb-6">{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
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
