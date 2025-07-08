'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin, Clock, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
        image: '/menu/Capriottis-Bobbie-Tray.webp'
      },
      {
        id: 'cap2',
        name: 'Little Italy Party Tray',
        description: 'Classic Italian sub with premium meats and cheese, cut for sharing. Serves 10-12 people.',
        price: 84.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Little-Italy-Tray.webp'
      },
      {
        id: 'cap3',
        name: 'Delaware\'s Finest Party Tray',
        description: 'Premium turkey and cheese with fresh vegetables. Serves 10-12 people.',
        price: 87.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-DelawaresFinest-Tray.webp'
      },
      {
        id: 'cap4',
        name: 'Turkey Lovers Party Tray',
        description: 'Fresh roasted turkey with premium fixings. Serves 10-12 people.',
        price: 82.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Turkey-Lovers-Tray.webp'
      },
      {
        id: 'cap5',
        name: 'Vegetarian Party Tray',
        description: 'Fresh vegetables with cheese and Italian dressing. Serves 10-12 people.',
        price: 74.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/Capriottis-Vegetarian-Tray.webp'
      },
      {
        id: 'cap6',
        name: 'Wagyu Cheese Steak Party Tray',
        description: 'Premium Wagyu beef cheese steak with grilled onions and peppers. Serves 10-12 people.',
        price: 109.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Waygu-Tray.webp'
      },
      {
        id: 'cap7',
        name: 'Assorted Cookie Tray',
        description: 'Fresh baked cookies - chocolate chip, oatmeal raisin, and sugar cookies.',
        price: 24.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'cap8',
        name: 'Assorted Sodas (12-pack)',
        description: 'Variety pack of Coca-Cola products.',
        price: 18.99,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop&crop=center'
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
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'sushi2',
        name: 'Salmon Nigiri (2 pieces)',
        description: 'Fresh salmon over seasoned sushi rice',
        price: 6.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'sushi3',
        name: 'Spicy Tuna Roll',
        description: 'Spicy tuna with cucumber and spicy mayo',
        price: 9.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'sushi4',
        name: 'Vegetable Roll',
        description: 'Cucumber, avocado, carrot, and lettuce',
        price: 7.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'sushi5',
        name: 'Mochi Ice Cream',
        description: 'Sweet rice cake filled with ice cream (3 pieces)',
        price: 5.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'sushi6',
        name: 'Green Tea',
        description: 'Hot or iced traditional Japanese green tea',
        price: 2.99,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center'
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
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza2',
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with mozzarella cheese',
        price: 16.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza3',
        name: 'Supreme Pizza',
        description: 'Pepperoni, sausage, peppers, onions, mushrooms, olives',
        price: 19.99,
        category: 'main' as const,
        dietaryInfo: [],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza4',
        name: 'Garlic Bread',
        description: 'Fresh baked bread with garlic butter and herbs',
        price: 6.99,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1619985632461-f33748ef8d3d?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza5',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 7.99,
        category: 'dessert' as const,
        dietaryInfo: ['vegetarian'],
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center'
      },
      {
        id: 'pizza6',
        name: 'Italian Soda',
        description: 'Sparkling water with Italian syrup flavors',
        price: 3.49,
        category: 'beverage' as const,
        dietaryInfo: ['vegetarian', 'vegan'],
        image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop&crop=center'
      }
    ]
  }
};

interface CartItem extends OrderItem {
  id: string;
  image?: string;
}

export default function OrderPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [selectedRestaurant, setSelectedRestaurant] = useState<keyof typeof restaurantMenus>('capriottis');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Payment-related state
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Handle form submission (proceed to payment)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!deliveryInfo.date || !deliveryInfo.time || !deliveryInfo.address.street || !deliveryInfo.address.city || !deliveryInfo.address.state || !deliveryInfo.address.zipCode) {
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

    // Check authentication before proceeding to payment
    if (!isAuthenticated) {
      setErrorMessage('Please log in to place an order.');
      setShowErrorModal(true);
      return;
    }

    // Proceed to payment
    setShowPayment(true);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setIsSubmitting(true);

    try {
      // Create order with payment information
      const orderData: CreateOrderData = {
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        deliveryDate: deliveryInfo.date,
        deliveryTime: deliveryInfo.time,
        deliveryAddress: {
          street: deliveryInfo.address.street,
          city: deliveryInfo.address.city,
          state: deliveryInfo.address.state,
          zipCode: deliveryInfo.address.zipCode
        },
        specialInstructions: deliveryInfo.specialInstructions,
        paymentIntentId: paymentIntentId
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Order created successfully
        setShowSuccessModal(true);
        setCart([]);
        setDeliveryInfo({
          date: '',
          time: '',
          address: { street: '', city: '', state: 'NV', zipCode: '' },
          specialInstructions: ''
        });
        setShowPayment(false);
        setPaymentIntentId(null);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create order. Please contact support.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setErrorMessage(`Payment failed: ${error}`);
    setShowErrorModal(true);
    setIsProcessingPayment(false);
  };

  // Delivery information state
  const [deliveryInfo, setDeliveryInfo] = useState({
    date: '',
    time: '',
    address: {
      street: '',
      city: '',
      state: 'NV', // Default to Nevada since this is CaterVegas
      zipCode: ''
    },
    specialInstructions: ''
  });

  // Pre-fill date and time from URL parameters if coming from schedule page
  useEffect(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');

    if (dateParam || timeParam) {
      setDeliveryInfo(prev => ({
        ...prev,
        ...(dateParam && { date: dateParam }),
        ...(timeParam && { time: timeParam })
      }));
    }
  }, [searchParams]);

  // Handle click outside time picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    if (showTimePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTimePicker]);

  // Generate time options (every 30 minutes from 6:00 AM to 10:00 PM)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Handle time selection
  const handleTimeSelect = (timeValue: string) => {
    setDeliveryInfo({ ...deliveryInfo, time: timeValue });
    setShowTimePicker(false);
  };

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
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <Navigation />

      {/* Hero Section */}
      <div style={{ backgroundColor: 'rgb(255, 255, 255)', borderBottom: '1px solid rgb(113, 113, 122)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Order <span style={{ color: 'rgb(113, 113, 122)' }}>Premium</span> Catering
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgb(15, 15, 15)' }}>
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
              <div className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                1
              </div>
              <span className="ml-3 text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>Select Restaurant</span>
            </div>
            <div className="w-16 h-1 rounded" style={{ backgroundColor: 'rgb(15, 15, 15)' }}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                cart.length > 0 ? 'text-white' : ''
              }`} style={{
                backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)',
                color: cart.length > 0 ? 'white' : 'white'
              }}>
                2
              </div>
              <span className={`ml-3 text-lg font-semibold`} style={{
                color: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
              }}>Build Your Order</span>
            </div>
            <div className={`w-16 h-1 rounded`} style={{
              backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
            }}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white`} style={{
                backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
              }}>
                3
              </div>
              <span className={`ml-3 text-lg font-semibold`} style={{
                color: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
              }}>Complete Order</span>
            </div>
          </div>
        </div>

        {/* Step 1: Restaurant Selection */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Step 1: Choose Your <span style={{ color: 'rgb(113, 113, 122)' }}>Restaurant</span>
            </h2>
            <p className="text-lg" style={{ color: 'rgb(15, 15, 15)' }}>Select from our curated collection of premium catering partners</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Capriotti's Option */}
            <div
              onClick={() => handleRestaurantSelection('capriottis')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              style={{
                backgroundColor: selectedRestaurant === 'capriottis'
                  ? 'rgb(15, 15, 15)'
                  : 'rgb(255, 255, 255)',
                border: selectedRestaurant === 'capriottis'
                  ? 'none'
                  : '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                  style={{
                    backgroundColor: selectedRestaurant === 'capriottis'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgb(113, 113, 122)'
                  }}>
                  <span className="text-3xl font-bold text-white">🥪</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2`} style={{
                  color: selectedRestaurant === 'capriottis' ? 'white' : 'rgb(15, 15, 15)'
                }}>
                  Capriotti's
                </h3>
                <p className={`text-lg mb-4`} style={{
                  color: selectedRestaurant === 'capriottis' ? 'rgba(255, 255, 255, 0.9)' : 'rgb(113, 113, 122)'
                }}>
                  Sandwich Shop
                </p>
                <p className={`text-sm`} style={{
                  color: selectedRestaurant === 'capriottis' ? 'rgba(255, 255, 255, 0.8)' : 'rgb(15, 15, 15)'
                }}>
                  Premium catering trays, box lunches & gourmet salads
                </p>
                {selectedRestaurant === 'capriottis' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                    <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sushi on Demand Option */}
            <div
              onClick={() => handleRestaurantSelection('sushi')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              style={{
                backgroundColor: selectedRestaurant === 'sushi'
                  ? 'rgb(15, 15, 15)'
                  : 'rgb(255, 255, 255)',
                border: selectedRestaurant === 'sushi'
                  ? 'none'
                  : '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                  style={{
                    backgroundColor: selectedRestaurant === 'sushi'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgb(113, 113, 122)'
                  }}>
                  <span className="text-3xl font-bold text-white">🍣</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2`} style={{
                  color: selectedRestaurant === 'sushi' ? 'white' : 'rgb(15, 15, 15)'
                }}>
                  Sushi on Demand
                </h3>
                <p className={`text-lg mb-4`} style={{
                  color: selectedRestaurant === 'sushi' ? 'rgba(255, 255, 255, 0.9)' : 'rgb(113, 113, 122)'
                }}>
                  Japanese Cuisine
                </p>
                <p className={`text-sm`} style={{
                  color: selectedRestaurant === 'sushi' ? 'rgba(255, 255, 255, 0.8)' : 'rgb(15, 15, 15)'
                }}>
                  Fresh sushi boats, custom platters & premium rolls
                </p>
                {selectedRestaurant === 'sushi' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                    <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pizza Place Option */}
            <div
              onClick={() => handleRestaurantSelection('pizza')}
              className={`group relative cursor-pointer rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
              style={{
                backgroundColor: selectedRestaurant === 'pizza'
                  ? 'rgb(15, 15, 15)'
                  : 'rgb(255, 255, 255)',
                border: selectedRestaurant === 'pizza'
                  ? 'none'
                  : '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}
                  style={{
                    backgroundColor: selectedRestaurant === 'pizza'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgb(113, 113, 122)'
                  }}>
                  <span className="text-3xl font-bold text-white">🍕</span>
                </div>
                <h3 className={`text-2xl font-bold mb-2`} style={{
                  color: selectedRestaurant === 'pizza' ? 'white' : 'rgb(15, 15, 15)'
                }}>
                  Pizza Place
                </h3>
                <p className={`text-lg mb-4`} style={{
                  color: selectedRestaurant === 'pizza' ? 'rgba(255, 255, 255, 0.9)' : 'rgb(113, 113, 122)'
                }}>
                  Italian Cuisine
                </p>
                <p className={`text-sm`} style={{
                  color: selectedRestaurant === 'pizza' ? 'rgba(255, 255, 255, 0.8)' : 'rgb(15, 15, 15)'
                }}>
                  Artisan pizzas, appetizers & Italian desserts
                </p>
                {selectedRestaurant === 'pizza' && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                    <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Menu Selection */}
        <div id="menu-section" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Step 2: Build Your <span style={{ color: 'rgb(113, 113, 122)' }}>Order</span>
            </h2>
            <p className="text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
              Explore the menu from <span className="font-semibold" style={{ color: 'rgb(113, 113, 122)' }}>{restaurantMenus[selectedRestaurant].name}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Main Items Section */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                    🍽️
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Main Items</h3>
                    <p style={{ color: 'rgb(113, 113, 122)' }}>Premium entrees and signature dishes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentMenu.filter(item => item.category === 'main').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      style={{
                        backgroundColor: 'rgb(255, 255, 255)',
                        border: '2px solid rgb(113, 113, 122)'
                      }}
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
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-bold transition-colors duration-200" style={{
                            color: 'rgb(15, 15, 15)'
                          }}>
                            {item.name}
                          </h4>
                          <div className="text-right">
                            <span className="text-2xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <p className="mb-4 leading-relaxed" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

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
                            <div className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(113, 113, 122)' }}>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                              >
                                <Minus size={18} />
                              </button>
                              <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="w-full text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                              style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
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
                    <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                      🍰
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Desserts & Treats</h3>
                      <p style={{ color: 'rgb(113, 113, 122)' }}>Sweet endings to your perfect meal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentMenu.filter(item => item.category === 'dessert').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '2px solid rgb(113, 113, 122)'
                        }}
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
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold transition-colors duration-200" style={{
                              color: 'rgb(15, 15, 15)'
                            }}>
                              {item.name}
                            </h4>
                            <div className="text-right">
                              <span className="text-2xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <p className="mb-4 leading-relaxed" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

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
                              <div className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(113, 113, 122)' }}>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
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
                    <div className="w-12 h-12 text-white rounded-xl flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                      🥤
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Beverages</h3>
                      <p style={{ color: 'rgb(113, 113, 122)' }}>Refreshing drinks to complement your meal</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {currentMenu.filter(item => item.category === 'beverage').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '2px solid rgb(113, 113, 122)'
                        }}
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
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                          </div>
                        )}

                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-bold transition-colors duration-200" style={{
                              color: 'rgb(15, 15, 15)'
                            }}>
                              {item.name}
                            </h4>
                            <div className="text-right">
                              <span className="text-2xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <p className="mb-4 leading-relaxed" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

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
                              <div className="flex items-center gap-3 rounded-xl p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(113, 113, 122)' }}>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                  {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-10 h-10 text-white rounded-lg transition-all duration-200 flex items-center justify-center hover:scale-105"
                                  style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="w-full text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
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
              <div className="rounded-2xl shadow-xl p-6 sticky top-8" style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid rgb(113, 113, 122)'
              }}>
                <div className="flex items-center mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 text-white`} style={{
                    backgroundColor: cart.length > 0 ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)'
                  }}>
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Your Order</h3>
                    <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>Review and complete</p>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgb(113, 113, 122)' }}>
                      <ShoppingCart size={24} className="text-white" />
                    </div>
                    <p className="text-lg" style={{ color: 'rgb(15, 15, 15)' }}>Your cart is empty</p>
                    <p className="text-sm mt-2" style={{ color: 'rgb(113, 113, 122)' }}>Add items from the menu</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="rounded-lg p-3" style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '1px solid rgb(113, 113, 122)'
                        }}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.name}</h4>
                            <span className="font-bold text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 text-white rounded transition flex items-center justify-center"
                                style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-medium min-w-[1.5rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => addItemFromCart(item)}
                                className="w-6 h-6 text-white rounded transition flex items-center justify-center"
                                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-xs" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)} each</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-4" style={{ borderTop: '1px solid rgb(113, 113, 122)' }}>
                      <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(15, 15, 15, 0.05)' }}>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Total:</span>
                          <span className="text-2xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${total.toFixed(2)}</span>
                        </div>
                        <div className="text-sm mt-1" style={{ color: 'rgb(15, 15, 15)' }}>
                          {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4" style={{ borderTop: '1px solid rgb(113, 113, 122)' }}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
                          <Calendar size={16} />
                          Delivery Details
                        </h4>
                        {(searchParams.get('date') || searchParams.get('time')) && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{
                            backgroundColor: 'rgba(15, 15, 15, 0.1)',
                            color: 'rgb(113, 113, 122)'
                          }}>
                            📅 From Schedule
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>Date</label>
                          <input
                            type="date"
                            value={deliveryInfo.date}
                            onChange={(e) => setDeliveryInfo({...deliveryInfo, date: e.target.value})}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          />
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>Time</label>
                          <div
                            onClick={() => setShowTimePicker(!showTimePicker)}
                            className="w-full rounded-lg px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                          >
                            <span>
                              {deliveryInfo.time ?
                                new Date(`2000-01-01T${deliveryInfo.time}`).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                }) :
                                'Select time'
                              }
                            </span>
                            <Clock size={16} style={{ color: 'rgb(113, 113, 122)' }} />
                          </div>

                          {showTimePicker && (
                            <div
                              ref={timePickerRef}
                              className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                              style={{
                                backgroundColor: 'rgb(255, 255, 255)',
                                border: '2px solid rgb(113, 113, 122)'
                              }}
                            >
                              {/* Close button */}
                              <div className="sticky top-0 flex justify-between items-center p-2" style={{ backgroundColor: 'rgb(255, 255, 255)', borderBottom: '1px solid rgb(113, 113, 122)' }}>
                                <span className="text-sm font-medium" style={{ color: 'rgb(15, 15, 15)' }}>Select Time</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTimePicker(false);
                                  }}
                                  className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                                  style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                                >
                                  <X size={12} className="text-white" />
                                </button>
                              </div>

                              {/* Time options */}
                              <div className="p-1">
                                {timeOptions.map((time) => (
                                  <div
                                    key={time.value}
                                    onClick={() => handleTimeSelect(time.value)}
                                    className="px-3 py-2 text-sm cursor-pointer rounded transition-colors duration-150"
                                    style={{
                                      color: deliveryInfo.time === time.value ? 'white' : 'rgb(15, 15, 15)',
                                      backgroundColor: deliveryInfo.time === time.value ? 'rgb(15, 15, 15)' : 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (deliveryInfo.time !== time.value) {
                                        e.currentTarget.style.backgroundColor = 'rgba(113, 113, 122, 0.1)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (deliveryInfo.time !== time.value) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                      }
                                    }}
                                  >
                                    {time.display}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 flex items-center gap-2" style={{ color: 'rgb(15, 15, 15)' }}>
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
                          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 mb-2"
                          style={{
                            border: '1px solid rgb(113, 113, 122)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(15, 15, 15)'
                          }}
                          required
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={deliveryInfo.address.city}
                            onChange={(e) => setDeliveryInfo({
                              ...deliveryInfo,
                              address: {...deliveryInfo.address, city: e.target.value}
                            })}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          />
                          <select
                            value={deliveryInfo.address.state}
                            onChange={(e) => setDeliveryInfo({
                              ...deliveryInfo,
                              address: {...deliveryInfo.address, state: e.target.value}
                            })}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          >
                            <option value="NV">Nevada</option>
                            <option value="CA">California</option>
                            <option value="AZ">Arizona</option>
                            <option value="UT">Utah</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Zip Code"
                            value={deliveryInfo.address.zipCode}
                            onChange={(e) => setDeliveryInfo({
                              ...deliveryInfo,
                              address: {...deliveryInfo.address, zipCode: e.target.value}
                            })}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                            style={{
                              border: '1px solid rgb(113, 113, 122)',
                              backgroundColor: 'rgb(255, 255, 255)',
                              color: 'rgb(15, 15, 15)'
                            }}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>Special Instructions</label>
                        <textarea
                          placeholder="Any special delivery instructions..."
                          value={deliveryInfo.specialInstructions}
                          onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                          className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                          style={{
                            border: '1px solid rgb(113, 113, 122)',
                            backgroundColor: 'rgb(255, 255, 255)',
                            color: 'rgb(15, 15, 15)'
                          }}
                          rows={2}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full text-white py-3 px-4 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)')}
                        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)')}
                      >
                        {isSubmitting ? 'Processing...' : `Proceed to Payment - $${total.toFixed(2)}`}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Payment Modal */}
        {showPayment && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-xl shadow-2xl max-w-sm w-full p-6 max-h-[85vh] overflow-y-auto"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid rgb(113, 113, 122)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.8)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>Complete Payment</h3>
                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-2xl font-bold transition hover:scale-110"
                    style={{ color: 'rgb(113, 113, 122)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(82, 82, 91)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(15, 15, 15, 0.05)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: 'rgb(15, 15, 15)' }}>Order Total:</span>
                    <span className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>${total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items • Delivery: {deliveryInfo.date} at {deliveryInfo.time}
                  </div>
                </div>

                <StripePaymentForm
                  amount={total}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isProcessing={isProcessingPayment}
                  setIsProcessing={setIsProcessingPayment}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="rounded-xl shadow-2xl max-w-md w-full p-8"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid rgb(15, 15, 15)'
              }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-3"
                  style={{ color: 'rgb(15, 15, 15)' }}
                >
                  Order Placed Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 text-lg"
                  style={{ color: 'rgb(113, 113, 122)' }}
                >
                  Thank you for your order! You will receive a confirmation email shortly with all the details.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full text-white px-6 py-3 rounded-lg transition font-semibold"
                    style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.location.href = '/schedule';
                    }}
                    className="w-full px-6 py-3 rounded-lg transition font-medium"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid rgb(113, 113, 122)',
                      color: 'rgb(113, 113, 122)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgb(113, 113, 122)';
                    }}
                  >
                    View Schedule
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl shadow-xl max-w-md w-full p-6"
              style={{
                backgroundColor: 'rgb(255, 255, 255)',
                border: '2px solid rgb(113, 113, 122)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4" style={{ color: 'rgb(113, 113, 122)' }}>⚠️</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Unable to Place Order</h3>
                <p className="mb-6" style={{ color: 'rgb(15, 15, 15)' }}>{errorMessage}</p>
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="text-white px-6 py-2 rounded-lg transition"
                  style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
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
