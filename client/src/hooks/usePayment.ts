import { useState } from 'react';
import { orderService, CreateOrderData } from '@/lib/services/orders';
import { CartItem } from './useCart';
import { DeliveryInfo } from './useDeliveryForm';

export const usePayment = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission (proceed to payment)
  const handleSubmit = async (
    cart: CartItem[],
    deliveryInfo: DeliveryInfo,
    isAuthenticated: boolean
  ) => {
    // Basic validation
    if (!deliveryInfo.date || !deliveryInfo.time || !deliveryInfo.address.street || 
        !deliveryInfo.address.city || !deliveryInfo.address.state || !deliveryInfo.address.zipCode) {
      setErrorMessage('Please fill in all required delivery information.');
      setShowErrorModal(true);
      return false;
    }

    // Check if delivery is at least 12 hours in advance
    const deliveryDateTime = new Date(`${deliveryInfo.date}T${deliveryInfo.time}`);
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    if (deliveryDateTime < twelveHoursFromNow) {
      setErrorMessage('Orders must be placed at least 12 hours in advance of the delivery time.');
      setShowErrorModal(true);
      return false;
    }

    // Check authentication before proceeding to payment
    if (!isAuthenticated) {
      setErrorMessage('Please log in to place an order.');
      setShowErrorModal(true);
      return false;
    }

    // Proceed to payment
    setShowPayment(true);
    return true;
  };

  // Handle successful payment
  const handlePaymentSuccess = async (
    paymentIntentId: string,
    cart: CartItem[],
    deliveryInfo: DeliveryInfo,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);

    try {
      // Create order with payment information
      const orderData: CreateOrderData = {
        items: cart.map(item => ({
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          dietaryInfo: item.dietaryInfo
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
        setShowPayment(false);
        setPaymentIntentId(null);
        onSuccess?.();
        return true;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create order. Please contact support.');
      setShowErrorModal(true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    console.log('handlePaymentError called with:', error);
    setErrorMessage(`Payment failed: ${error}`);
    setShowErrorModal(true);
    setIsProcessingPayment(false);
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Close error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  // Reset payment state
  const resetPaymentState = () => {
    setShowPayment(false);
    setIsProcessingPayment(false);
    setPaymentIntentId(null);
    setShowSuccessModal(false);
    setShowErrorModal(false);
    setErrorMessage('');
    setIsSubmitting(false);
  };

  return {
    // State
    showPayment,
    isProcessingPayment,
    paymentIntentId,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    isSubmitting,
    
    // Actions
    handleSubmit,
    handlePaymentSuccess,
    handlePaymentError,
    closeSuccessModal,
    closeErrorModal,
    resetPaymentState,
    
    // Setters (for direct control if needed)
    setShowPayment,
    setIsProcessingPayment,
    setPaymentIntentId
  };
};
