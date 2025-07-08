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
  isCustomizable?: boolean;
  pricing?: { small: number; large: number };
  flavors?: string[];
};

// Individual sandwich options for sampler plate
const capriottisIndividualSandwiches = [
  { id: 'bobbie', name: 'The Bobbie®', isWagyu: false, image: '/menu/sandwiches/Bobbie-sand.webp' },
  { id: 'cole-turkey', name: 'Cole Turkey®', isWagyu: false, image: '/menu/sandwiches/cole-turkey.webp' },
  { id: 'wagyu-slaw', name: 'American Wagyu Slaw Be Jo®', isWagyu: true, image: '/menu/sandwiches/american-waygu-slaw-sand.webp' },
  { id: 'wagyu-roast', name: 'American Wagyu Roast Beef', isWagyu: true, image: '/menu/sandwiches/american-waygu-club-sand.webp' },
  { id: 'veggie-turkey', name: 'Veggie Turkey', isWagyu: false, image: '/menu/sandwiches/plant-based-turkey-sand.webp' },
  { id: 'veggie-cole', name: 'Veggie Cole Turkey®', isWagyu: false, image: '/menu/sandwiches/plant-based-cole-sand.webp' },
  { id: 'homemade-turkey', name: 'Homemade Turkey Sub', isWagyu: false, image: '/menu/sandwiches/home-made-turkey.webp' },
  { id: 'italian-sub', name: 'Italian Sub', isWagyu: false, image: '/menu/sandwiches/italian-sand.webp' },
  { id: 'tuna-sub', name: 'Tuna Sub', isWagyu: false, image: '/menu/sandwiches/tuna-sand.webp' },
  { id: 'blt', name: 'The BLT', isWagyu: false, image: '/menu/sandwiches/blt-sand.webp' },
  { id: 'cheese-sub', name: 'Cheese Sub', isWagyu: false, image: '/menu/sandwiches/soda-bottles.webp' },
  { id: 'classic-club', name: 'Classic Club', isWagyu: false, image: '/menu/sandwiches/classic-club.webp' },
  { id: 'wagyu-club', name: 'Wagyu Club', isWagyu: true, image: '/menu/sandwiches/american-waygu-club-sand.webp' }
];

// Restaurant menu data
const restaurantMenus = {
  "capriottis": {
    name: "Capriotti's Sandwich Shop",
    items: [
      {
        id: 'cap1',
        name: 'The Bobbie® Party Tray',
        description: 'A tray loaded with the greatest sandwich in America. Homemade turkey, cranberry sauce, stuffing and mayo.',
        price: 0, // Price will be shown in size selection modal
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Bobbie-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap2',
        name: 'Little Italy Party Tray',
        description: 'Paying homage to our heritage, this tray is loaded with nothing but tasty Italian subs (served with a side of pickles, hot and sweet peppers).',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Little-Italy-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap3',
        name: 'Delaware\'s Finest Party Tray',
        description: 'An assortment of our Cap\'s classics: The Bobbie®, Slaw Be Jo®, and the Italian sub (served with pickles, hot and sweet peppers).',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-DelawaresFinest-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap4',
        name: 'Turkey Lovers Party Tray',
        description: 'Assortment of our delicious oven-roasted turkey subs: The Bobbie®, Cole Turkey®, and the Homemade Turkey sub (served with a side of mayo, mustard, pickles and peppers).',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Turkey-Lovers-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.99 }
      },
      {
        id: 'cap5',
        name: 'Vegetarian Party Tray',
        description: 'Assortment of our delicious vegetarian subs made with meatless products and veggies: Veggie Turkey, Veggie Cole Turkey®, and Cheese sub.',
        price: 0,
        category: 'main' as const,
        dietaryInfo: ['vegetarian'],
        image: '/menu/Capriottis-Vegetarian-Tray.webp',
        isCustomizable: true,
        pricing: { small: 71.99, large: 93.49 }
      },
      {
        id: 'cap6',
        name: 'American Wagyu Party Tray',
        description: 'A tray of our finest American Wagyu beef subs: The American Wagyu Slaw Be Jo® and the American Wagyu Roast Beef.',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Waygu-Tray.webp',
        isCustomizable: true,
        pricing: { small: 80.99, large: 101.99 }
      },
      {
        id: 'cap7',
        name: 'The Club Party Tray',
        description: 'Classic club sandwich with turkey, ham, and bacon.',
        price: 0,
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Club-Tray.webp',
        isCustomizable: true,
        pricing: { small: 81.59, large: 103.29 }
      },

      {
        id: 'cap-sampler',
        name: 'Sampler Plate',
        description: 'Choose your own combination of our signature sandwiches. Perfect for trying multiple favorites!',
        price: 73.99, // Base price for small (Build Your Own pricing)
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Bobbie-Tray.webp', // Placeholder until you provide sampler image
        isCustomizable: true
      },
      {
        id: 'cap-cookie-tray',
        name: 'Cookie Tray',
        description: 'Fresh baked cookies - chocolate chip, oatmeal raisin, and sugar cookies.',
        price: 21.99,
        category: 'dessert' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-cookie-tray.webp'
      },
      {
        id: 'cap-cookie-brookie-tray',
        name: 'Cookie/Brookie Tray',
        description: 'Delicious combination of cookies and brownies for the perfect sweet treat.',
        price: 24.99,
        category: 'dessert' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Cookie-brookie-Tray.webp'
      },
      {
        id: 'cap-soda',
        name: '20oz Bottle',
        description: 'Choose from our selection of refreshing beverages.',
        price: 3.29,
        category: 'beverage' as const,
        dietaryInfo: [],
        image: '/menu/sandwiches/soda-bottles.webp',
        isCustomizable: true,
        flavors: ['Mountain Dew', 'Pepsi', 'Pepsi No Sugar', 'Blue Gatorade']
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

  // Sampler plate state
  const [showSamplerModal, setShowSamplerModal] = useState(false);
  const [samplerSize, setSamplerSize] = useState<'small' | 'large'>('small');
  const [selectedSandwiches, setSelectedSandwiches] = useState<{id: string, count: number}[]>([]);
  const samplerModalRef = useRef<HTMLDivElement>(null);

  // Tray size selection state
  const [showTrayModal, setShowTrayModal] = useState(false);
  const [selectedTray, setSelectedTray] = useState<any>(null);
  const [trayQuantities, setTrayQuantities] = useState<{small: number, large: number}>({small: 0, large: 0});
  const trayModalRef = useRef<HTMLDivElement>(null);

  // Soda flavor selection state
  const [showSodaModal, setShowSodaModal] = useState(false);
  const [selectedSoda, setSelectedSoda] = useState<any>(null);
  const [sodaQuantities, setSodaQuantities] = useState<{[key: string]: number}>({});
  const sodaModalRef = useRef<HTMLDivElement>(null);

  // Calculate sampler price with Wagyu upcharges
  const calculateSamplerPrice = () => {
    const basePrice = samplerSize === 'small' ? 73.99 : 97.99;
    const wagyuUpcharge = 7.29;

    const wagyuCount = selectedSandwiches.reduce((count, item) => {
      const sandwich = capriottisIndividualSandwiches.find(s => s.id === item.id);
      // Only count Wagyu sandwiches
      return sandwich?.isWagyu ? count + item.count : count;
    }, 0);

    return basePrice + (wagyuCount * wagyuUpcharge);
  };

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

  // Add item to cart with specific quantity
  const addToCartWithQuantity = (menuItem: typeof currentMenu[0], quantity: number) => {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMenu.filter(item => item.category === 'main').map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                      style={{
                        backgroundColor: 'rgb(255, 255, 255)',
                        border: '2px solid rgb(113, 113, 122)'
                      }}
                    >
                      {item.image && (
                        <div className="h-40 w-full overflow-hidden relative">
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

                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold transition-colors duration-200" style={{
                            color: 'rgb(15, 15, 15)'
                          }}>
                            {item.name}
                          </h4>
                          {!('isCustomizable' in item && item.isCustomizable) && (
                            <div className="text-right">
                              <span className="text-xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                        <p className="mb-3 leading-relaxed flex-grow text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

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
                        <div className="flex items-center justify-between mt-auto">
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
                                onClick={() => {
                                  if (item.id === 'cap-sampler') {
                                    setShowSamplerModal(true);
                                  } else if (item.id === 'cap-soda') {
                                    setSelectedSoda(item);
                                    const initialQuantities: {[key: string]: number} = {};
                                    if ('flavors' in item && item.flavors) {
                                      (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                    }
                                    setSodaQuantities(initialQuantities);
                                    setShowSodaModal(true);
                                  } else if ('isCustomizable' in item && item.isCustomizable && 'pricing' in item && item.pricing) {
                                    setSelectedTray(item);
                                    setTrayQuantities({small: 0, large: 0}); // Reset quantities
                                    setShowTrayModal(true);
                                  } else {
                                    addToCart(item);
                                  }
                                }}
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
                              onClick={() => {
                                if (item.id === 'cap-sampler') {
                                  setShowSamplerModal(true);
                                } else if (item.id === 'cap-soda') {
                                  setSelectedSoda(item);
                                  const initialQuantities: {[key: string]: number} = {};
                                  if ('flavors' in item && item.flavors) {
                                    (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                  }
                                  setSodaQuantities(initialQuantities);
                                  setShowSodaModal(true);
                                } else if ('isCustomizable' in item && item.isCustomizable && 'pricing' in item && item.pricing) {
                                  setSelectedTray(item);
                                  setTrayQuantities({small: 0, large: 0}); // Reset quantities
                                  setShowTrayModal(true);
                                } else {
                                  addToCart(item);
                                }
                              }}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMenu.filter(item => item.category === 'dessert').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '2px solid rgb(113, 113, 122)'
                        }}
                      >
                        {item.image && (
                          <div className="h-40 w-full overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                                item.id === 'cap-cookie-brookie-tray' ? 'object-[center_70%]' : ''
                              }`}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(15, 15, 15, 0.2), transparent)' }}></div>
                          </div>
                        )}

                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold transition-colors duration-200" style={{
                              color: 'rgb(15, 15, 15)'
                            }}>
                              {item.name}
                            </h4>
                            {!('isCustomizable' in item && item.isCustomizable) && (
                              <div className="text-right">
                                <span className="text-xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mb-3 leading-relaxed flex-grow text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

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
                          <div className="flex items-center justify-between mt-auto">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentMenu.filter(item => item.category === 'beverage').map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                        style={{
                          backgroundColor: 'rgb(255, 255, 255)',
                          border: '2px solid rgb(113, 113, 122)'
                        }}
                      >
                        {item.image && (
                          <div className="h-40 w-full overflow-hidden relative">
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

                        <div className="p-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-bold transition-colors duration-200" style={{
                              color: 'rgb(15, 15, 15)'
                            }}>
                              {item.name}
                            </h4>
                            {!('isCustomizable' in item && item.isCustomizable) && (
                              <div className="text-right">
                                <span className="text-xl font-bold" style={{ color: 'rgb(113, 113, 122)' }}>${item.price.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mb-3 leading-relaxed flex-grow text-sm" style={{ color: 'rgb(15, 15, 15)' }}>{item.description}</p>

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
                          <div className="flex items-center justify-between mt-auto">
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
                                  onClick={() => {
                                    if (item.id === 'cap-soda') {
                                      setSelectedSoda(item);
                                      const initialQuantities: {[key: string]: number} = {};
                                      if ('flavors' in item && item.flavors) {
                                        (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                      }
                                      setSodaQuantities(initialQuantities);
                                      setShowSodaModal(true);
                                    } else {
                                      addToCart(item);
                                    }
                                  }}
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
                                onClick={() => {
                                  if (item.id === 'cap-soda') {
                                    setSelectedSoda(item);
                                    const initialQuantities: {[key: string]: number} = {};
                                    if ('flavors' in item && item.flavors) {
                                      (item.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                                    }
                                    setSodaQuantities(initialQuantities);
                                    setShowSodaModal(true);
                                  } else {
                                    addToCart(item);
                                  }
                                }}
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

        {/* Tray Size Selection Modal */}
        {showTrayModal && selectedTray && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              ref={trayModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto border-2 border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    Select Size
                  </h2>
                  <button
                    onClick={() => setShowTrayModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Item Name */}
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                  {selectedTray.name}
                </h3>

                {/* Description */}
                <p className="text-sm mb-6" style={{ color: 'rgb(113, 113, 122)' }}>
                  {selectedTray.description}
                </p>

                {/* Size Selection with Quantity */}
                <div className="space-y-4">
                  {/* Small Size */}
                  <div className="border-2 border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
                          Small
                        </h4>
                        <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                          Serves 8-10 people
                        </p>
                      </div>
                      <p className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                        ${selectedTray.pricing?.small.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          small: Math.max(0, prev.small - 1)
                        }))}
                        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                        {trayQuantities.small}
                      </span>
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          small: prev.small + 1
                        }))}
                        className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Large Size */}
                  <div className="border-2 border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
                          Large
                        </h4>
                        <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                          Serves 11-13 people
                        </p>
                      </div>
                      <p className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                        ${selectedTray.pricing?.large.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          large: Math.max(0, prev.large - 1)
                        }))}
                        className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                        {trayQuantities.large}
                      </span>
                      <button
                        onClick={() => setTrayQuantities(prev => ({
                          ...prev,
                          large: prev.large + 1
                        }))}
                        className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                      Total: ${((trayQuantities.small * selectedTray.pricing?.small) + (trayQuantities.large * selectedTray.pricing?.large)).toFixed(2)}
                    </span>
                    <span className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                      {trayQuantities.small + trayQuantities.large} item(s)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Add small items to cart
                      if (trayQuantities.small > 0) {
                        const smallItem = {
                          ...selectedTray,
                          id: `${selectedTray.id}-small-${Date.now()}`,
                          name: `${selectedTray.name} (Small)`,
                          description: `${selectedTray.description} Serves 8-10 people.`,
                          price: selectedTray.pricing.small
                        };
                        addToCartWithQuantity(smallItem, trayQuantities.small);
                      }

                      // Add large items to cart
                      if (trayQuantities.large > 0) {
                        const largeItem = {
                          ...selectedTray,
                          id: `${selectedTray.id}-large-${Date.now()}`,
                          name: `${selectedTray.name} (Large)`,
                          description: `${selectedTray.description} Serves 11-13 people.`,
                          price: selectedTray.pricing.large
                        };
                        addToCartWithQuantity(largeItem, trayQuantities.large);
                      }

                      // Reset and close modal
                      setTrayQuantities({small: 0, large: 0});
                      setShowTrayModal(false);
                    }}
                    disabled={trayQuantities.small + trayQuantities.large === 0}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                      trayQuantities.small + trayQuantities.large > 0
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Soda Flavor Selection Modal */}
        {showSodaModal && selectedSoda && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              ref={sodaModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto border-2 border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    Select Flavors
                  </h2>
                  <button
                    onClick={() => setShowSodaModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Item Name */}
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                  {selectedSoda.name}
                </h3>

                {/* Description */}
                <p className="text-sm mb-6" style={{ color: 'rgb(113, 113, 122)' }}>
                  ${selectedSoda.price.toFixed(2)} each - Select your favorite flavors
                </p>

                {/* Flavor Selection with Quantity */}
                <div className="space-y-4">
                  {selectedSoda.flavors?.map((flavor: string) => (
                    <div key={flavor} className="border-2 border-gray-200 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold text-lg" style={{ color: 'rgb(15, 15, 15)' }}>
                            {flavor}
                          </h4>
                          <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                            ${selectedSoda.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSodaQuantities(prev => ({
                            ...prev,
                            [flavor]: Math.max(0, (prev[flavor] || 0) - 1)
                          }))}
                          className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-lg font-bold min-w-[2rem] text-center" style={{ color: 'rgb(15, 15, 15)' }}>
                          {sodaQuantities[flavor] || 0}
                        </span>
                        <button
                          onClick={() => setSodaQuantities(prev => ({
                            ...prev,
                            [flavor]: (prev[flavor] || 0) + 1
                          }))}
                          className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                      Total: ${(Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0) * selectedSoda.price).toFixed(2)}
                    </span>
                    <span className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                      {Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0)} bottle(s)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Add each flavor with its quantity to cart
                      Object.entries(sodaQuantities).forEach(([flavor, quantity]) => {
                        if (quantity > 0) {
                          const sodaItem = {
                            ...selectedSoda,
                            id: `${selectedSoda.id}-${flavor.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            name: `${selectedSoda.name} - ${flavor}`,
                            description: `${flavor} flavored beverage`,
                            price: selectedSoda.price
                          };
                          addToCartWithQuantity(sodaItem, quantity);
                        }
                      });

                      // Reset and close modal
                      const initialQuantities: {[key: string]: number} = {};
                      (selectedSoda.flavors as string[]).forEach((flavor: string) => initialQuantities[flavor] = 0);
                      setSodaQuantities(initialQuantities);
                      setShowSodaModal(false);
                    }}
                    disabled={Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0) === 0}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                      Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0) > 0
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Sampler Plate Modal */}
        {showSamplerModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              ref={samplerModalRef}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                    Customize Your Sampler Plate
                  </h2>
                  <button
                    onClick={() => setShowSamplerModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgb(15, 15, 15)' }}>
                    Select Size <span className="text-red-500">Required</span>
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>Select 1 option</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => {
                        setSamplerSize('small');
                        setSelectedSandwiches([]); // Clear selections when changing size
                      }}
                      className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                        samplerSize === 'small' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                        Small - 3 Subs (8-10 people)
                      </h4>
                      <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>$73.99</p>
                    </div>

                    <div
                      onClick={() => {
                        setSamplerSize('large');
                        setSelectedSandwiches([]); // Clear selections when changing size
                      }}
                      className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${
                        samplerSize === 'large' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <h4 className="font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                        Large - 4 Subs (11-13 people)
                      </h4>
                      <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>$97.99</p>
                    </div>
                  </div>
                </div>

                {/* Sandwich Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'rgb(15, 15, 15)' }}>
                    {selectedSandwiches.reduce((sum, item) => sum + item.count, 0) < (samplerSize === 'small' ? 3 : 4)
                      ? `Select Sandwiches (${selectedSandwiches.reduce((sum, item) => sum + item.count, 0)}/${samplerSize === 'small' ? 3 : 4})`
                      : 'All Subs Selected'} <span className="text-red-500">Required</span>
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                    Click to add sandwiches. You can select the same sandwich multiple times.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {capriottisIndividualSandwiches.map((sandwich) => {
                      const selectedItem = selectedSandwiches.find(item => item.id === sandwich.id);
                      const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
                      const maxSandwiches = samplerSize === 'small' ? 3 : 4;
                      const isSelected = !!selectedItem;
                      const canAddMore = totalSelected < maxSandwiches;

                      return (
                        <div
                          key={sandwich.id}
                          className={`border-2 p-3 rounded-lg transition-all relative ${
                            isSelected
                              ? 'border-red-500 bg-red-50'
                              : canAddMore
                              ? 'border-gray-200 hover:border-gray-300 cursor-pointer'
                              : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <div
                            onClick={() => {
                              if (canAddMore) {
                                if (selectedItem) {
                                  // Increase count
                                  setSelectedSandwiches(selectedSandwiches.map(item =>
                                    item.id === sandwich.id
                                      ? { ...item, count: item.count + 1 }
                                      : item
                                  ));
                                } else {
                                  // Add new item
                                  setSelectedSandwiches([...selectedSandwiches, { id: sandwich.id, count: 1 }]);
                                }
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <img
                              src={sandwich.image}
                              alt={sandwich.name}
                              className="w-full h-20 object-cover rounded-lg mb-2"
                            />
                            <h4 className="font-semibold text-sm" style={{ color: 'rgb(15, 15, 15)' }}>
                              {sandwich.name}
                            </h4>
                            {sandwich.isWagyu && (
                              <p className="text-sm font-bold text-red-600">
                                +$7.29 Wagyu
                              </p>
                            )}
                          </div>

                          {/* Selection Controls */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white rounded-full px-2 py-1 shadow-md">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectedItem!.count > 1) {
                                    setSelectedSandwiches(selectedSandwiches.map(item =>
                                      item.id === sandwich.id
                                        ? { ...item, count: item.count - 1 }
                                        : item
                                    ));
                                  } else {
                                    setSelectedSandwiches(selectedSandwiches.filter(item => item.id !== sandwich.id));
                                  }
                                }}
                                className="w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                              >
                                -
                              </button>
                              <span className="text-sm font-bold min-w-[1rem] text-center">
                                {selectedItem!.count}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (canAddMore) {
                                    setSelectedSandwiches(selectedSandwiches.map(item =>
                                      item.id === sandwich.id
                                        ? { ...item, count: item.count + 1 }
                                        : item
                                    ));
                                  }
                                }}
                                disabled={!canAddMore}
                                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                                  canAddMore
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Sandwiches Summary */}
                {selectedSandwiches.length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                      Selected Sandwiches ({selectedSandwiches.reduce((sum, item) => sum + item.count, 0)}/{samplerSize === 'small' ? 3 : 4}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSandwiches.map((selectedItem) => {
                        const sandwich = capriottisIndividualSandwiches.find(s => s.id === selectedItem.id);
                        return (
                          <span
                            key={selectedItem.id}
                            className="bg-white px-3 py-1 rounded-full text-sm border flex items-center gap-2"
                          >
                            {sandwich?.name} {selectedItem.count > 1 && `(×${selectedItem.count})`}
                            <button
                              onClick={() => setSelectedSandwiches(selectedSandwiches.filter(item => item.id !== selectedItem.id))}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-right">
                    <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                      {(samplerSize === 'small' ? 3400 : 9320)} Cals | Qty: 1
                    </p>
                    <p className="text-lg font-bold" style={{ color: 'rgb(15, 15, 15)' }}>
                      ${calculateSamplerPrice().toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const maxSandwiches = samplerSize === 'small' ? 3 : 4;
                      const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
                      if (totalSelected === maxSandwiches) {
                        // Create description with quantities
                        const sandwichDescriptions = selectedSandwiches.map(item => {
                          const sandwich = capriottisIndividualSandwiches.find(s => s.id === item.id);
                          return item.count > 1
                            ? `${item.count}× ${sandwich?.name || ''}`
                            : sandwich?.name || '';
                        });

                        const finalPrice = calculateSamplerPrice();
                        const samplerItem = {
                          id: `cap-sampler-${Date.now()}`,
                          name: `Sampler Plate (${samplerSize === 'small' ? 'Small' : 'Large'})`,
                          description: `Custom sampler with ${sandwichDescriptions.join(', ')}`,
                          price: finalPrice,
                          category: 'main' as const,
                          dietaryInfo: [],
                          image: '/menu/Capriottis-Bobbie-Tray.webp',
                          restaurant: 'capriottis',
                          customization: {
                            size: samplerSize,
                            sandwiches: selectedSandwiches.map(item => ({
                              name: capriottisIndividualSandwiches.find(s => s.id === item.id)?.name || '',
                              count: item.count
                            }))
                          }
                        };
                        addToCart(samplerItem);
                        setShowSamplerModal(false);
                        setSelectedSandwiches([]);
                        setSamplerSize('small');
                      }
                    }}
                    disabled={selectedSandwiches.reduce((sum, item) => sum + item.count, 0) !== (samplerSize === 'small' ? 3 : 4)}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                      selectedSandwiches.reduce((sum, item) => sum + item.count, 0) === (samplerSize === 'small' ? 3 : 4)
                        ? 'bg-black hover:bg-gray-800'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Add to Cart
                  </button>
                </div>
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
