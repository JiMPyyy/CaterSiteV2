'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Calendar, MapPin, Clock, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, OrderItem, CreateOrderData } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';
import StripePaymentForm from '@/components/payment/StripePaymentForm';

// Import types and data
import { MenuItem } from '@/types/menu';
import { restaurantMenus } from '@/data/menus';

import { capriottisIndividualSandwiches } from '@/data/capriottis';

// Import modal components
import SamplerSizeModal from '@/components/modals/SamplerSizeModal';
import SamplerPlateModal from '@/components/modals/SamplerPlateModal';
import TraySelectionModal from '@/components/modals/TraySelectionModal';
import SodaFlavorModal from '@/components/modals/SodaFlavorModal';
import SushiPlatterModal from '@/components/modals/SushiPlatterModal';

// Import custom hooks
import { useCart } from '@/hooks/useCart';
import { useDeliveryForm } from '@/hooks/useDeliveryForm';
import { usePayment } from '@/hooks/usePayment';







export default function OrderPage() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [selectedRestaurant, setSelectedRestaurant] = useState<keyof typeof restaurantMenus>('capriottis');

  // Custom hooks
  const {
    cart,
    addToCart,

    addCustomItemToCart,
    removeFromCart,
    addItemFromCart,
    clearCart,
    getCartTotal
  } = useCart();

  const {
    deliveryInfo,
    updateDeliveryInfo,
    updateAddress,
    validateDeliveryInfo,
    resetDeliveryInfo,
    generateTimeOptions
  } = useDeliveryForm({
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || ''
  });

  const {
    showPayment,
    isProcessingPayment,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    isSubmitting,
    handleSubmit,
    handlePaymentSuccess,
    handlePaymentError,
    closeSuccessModal,
    closeErrorModal,
    setShowPayment,
    setIsProcessingPayment
  } = usePayment();

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Modal states - simplified
  const [showSamplerSizeModal, setShowSamplerSizeModal] = useState(false);
  const [showSamplerModal, setShowSamplerModal] = useState(false);
  const [selectedSamplerSize, setSelectedSamplerSize] = useState<'small' | 'large'>('small');
  const [showTrayModal, setShowTrayModal] = useState(false);
  const [selectedTray, setSelectedTray] = useState<any>(null);
  const [showSodaModal, setShowSodaModal] = useState(false);
  const [selectedSoda, setSelectedSoda] = useState<any>(null);
  const [showSushiPlatterModal, setShowSushiPlatterModal] = useState(false);
  const [selectedSushiPlatter, setSelectedSushiPlatter] = useState<any>(null);









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



  // Handle time selection
  const handleTimeSelect = (timeValue: string) => {
    updateDeliveryInfo({ time: timeValue });
    setShowTimePicker(false);
  };

  const currentMenu = restaurantMenus[selectedRestaurant].items;
  const timeOptions = generateTimeOptions();
  const total = getCartTotal();







  // Handle restaurant selection with auto-scroll
  const handleRestaurantSelection = (restaurant: keyof typeof restaurantMenus) => {
    setSelectedRestaurant(restaurant);
    clearCart(); // Clear cart when switching restaurants

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



  return (
    <div className="flex min-h-screen flex-col font-sans" style={{
      color: 'rgb(15, 15, 15)',
      backgroundColor: 'rgb(255, 255, 255)'
    }}>
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
                                    setShowSamplerSizeModal(true);
                                  } else if (item.id === 'cap-soda') {
                                    setSelectedSoda(item);
                                    setShowSodaModal(true);
                                  } else if (item.id === 'sushi-platter' || item.id === 'sushi-nigiri-platter' || item.id === 'sushi-sashimi-platter') {
                                    setSelectedSushiPlatter(item);
                                    setShowSushiPlatterModal(true);
                                  } else if ('isCustomizable' in item && item.isCustomizable && 'pricing' in item && item.pricing) {
                                    setSelectedTray(item);
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
                                  setShowSamplerSizeModal(true);
                                } else if (item.id === 'cap-soda') {
                                  setSelectedSoda(item);
                                  setShowSodaModal(true);
                                } else if (item.id === 'sushi-platter' || item.id === 'sushi-nigiri-platter' || item.id === 'sushi-sashimi-platter') {
                                  setSelectedSushiPlatter(item);
                                  setShowSushiPlatterModal(true);
                                } else if ('isCustomizable' in item && item.isCustomizable && 'pricing' in item && item.pricing) {
                                  setSelectedTray(item);
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
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(cart, deliveryInfo, isAuthenticated);
                    }} className="space-y-4 pt-4" style={{ borderTop: '1px solid rgb(113, 113, 122)' }}>
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
                            onChange={(e) => updateDeliveryInfo({ date: e.target.value })}
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
                          onChange={(e) => updateAddress({ street: e.target.value })}
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
                            onChange={(e) => updateAddress({ city: e.target.value })}
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
                            onChange={(e) => updateAddress({ state: e.target.value })}
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
                            onChange={(e) => updateAddress({ zipCode: e.target.value })}
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
                          onChange={(e) => updateDeliveryInfo({ specialInstructions: e.target.value })}
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
            className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4"
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
                  onPaymentSuccess={(paymentIntentId) => {
                    handlePaymentSuccess(paymentIntentId, cart, deliveryInfo, () => {
                      clearCart();
                      resetDeliveryInfo();
                    });
                  }}
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
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
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
                    onClick={closeSuccessModal}
                    className="w-full text-white px-6 py-3 rounded-lg transition font-semibold"
                    style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      closeSuccessModal();
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
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h2 className="text-xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>Error</h2>
              <p className="mb-6" style={{ color: 'rgb(15, 15, 15)' }}>{errorMessage}</p>
              <button
                onClick={closeErrorModal}
                className="text-white px-6 py-2 rounded-lg transition"
                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}


        {/* New Modal Components */}
        <SamplerSizeModal
          isOpen={showSamplerSizeModal}
          onClose={() => setShowSamplerSizeModal(false)}
          onSizeSelect={(size) => {
            setSelectedSamplerSize(size);
            setShowSamplerSizeModal(false);
            setShowSamplerModal(true);
          }}
        />

        <SamplerPlateModal
          isOpen={showSamplerModal}
          onClose={() => setShowSamplerModal(false)}
          selectedSize={selectedSamplerSize}
          onAddToCart={(item) => {
            addToCart(item);
          }}
        />

        <TraySelectionModal
          isOpen={showTrayModal}
          onClose={() => setShowTrayModal(false)}
          selectedTray={selectedTray}
          onAddToCart={(item) => {
            addToCart(item);
          }}
        />

        <SodaFlavorModal
          isOpen={showSodaModal}
          onClose={() => setShowSodaModal(false)}
          selectedSoda={selectedSoda}
          onAddToCart={(item) => {
            addToCart(item);
          }}
        />

        <SushiPlatterModal
          isOpen={showSushiPlatterModal}
          onClose={() => setShowSushiPlatterModal(false)}
          selectedPlatter={selectedSushiPlatter}
          onAddToCart={(item) => {
            addToCart(item);
          }}
        />
      </div>
    </div>
  );
}
