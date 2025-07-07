'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';

// Initialize Stripe
console.log('Stripe publishable key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, isProcessing, setIsProcessing }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Create payment intent when component mounts
  const createPaymentIntent = async () => {
    try {
      console.log('Creating payment intent for amount:', amount);
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`);

      // Get token using the correct key
      const token = localStorage.getItem('catervegas_token');
      console.log('Token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          customerEmail: 'customer@example.com' // You can get this from auth context
        })
      });

      console.log('Payment intent response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment intent HTTP error:', response.status, errorText);
        onPaymentError(`Payment setup failed (${response.status}). Please make sure you're logged in.`);
        return;
      }

      const data = await response.json();
      console.log('Payment intent response data:', data);

      if (data.success) {
        setClientSecret(data.data.clientSecret);
        console.log('Client secret set successfully');
        // Reset processing state after successful payment intent creation
        setIsProcessing(false);
      } else {
        console.error('Payment intent creation failed:', data);
        onPaymentError(data.message || 'Failed to initialize payment');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment intent creation error:', error);
      onPaymentError('Failed to initialize payment');
      setIsProcessing(false);
    }
  };

  // Handle payment submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Payment submission started');

    // Prevent double submission
    if (isSubmittingPayment) {
      console.log('Payment already in progress, ignoring submission');
      return;
    }

    if (!stripe || !elements || !clientSecret) {
      console.log('Payment submission blocked - missing requirements:', {
        stripe: !!stripe,
        elements: !!elements,
        clientSecret: !!clientSecret
      });
      return;
    }

    console.log('Setting processing to true');
    setIsSubmittingPayment(true);
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.log('Card element not found');
      setIsProcessing(false);
      return;
    }

    console.log('Confirming card payment with Stripe...');
    console.log('Client secret being used:', clientSecret);

    try {
      // Add a timeout to prevent infinite hanging
      const paymentPromise = stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Payment confirmation timed out')), 30000); // 30 second timeout
      });

      const { error, paymentIntent } = await Promise.race([paymentPromise, timeoutPromise]) as any;

      console.log('Stripe payment result:', { error, paymentIntent });

      setIsProcessing(false);
      setIsSubmittingPayment(false);

      if (error) {
        console.error('Payment error:', error);
        onPaymentError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        onPaymentSuccess(paymentIntent.id);
      } else {
        console.log('Unexpected payment status:', paymentIntent.status);
        onPaymentError('Payment was not completed successfully');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setIsProcessing(false);
      setIsSubmittingPayment(false);
      onPaymentError('Payment processing failed');
    }
  };

  // Initialize payment intent when amount changes
  React.useEffect(() => {
    if (amount > 0) {
      console.log('Amount changed, creating payment intent for:', amount);
      createPaymentIntent();
    }
  }, [amount]);

  // Debug button state
  React.useEffect(() => {
    console.log('Button state debug:', {
      stripe: !!stripe,
      isProcessing,
      clientSecret: !!clientSecret,
      buttonDisabled: !stripe || isProcessing || !clientSecret
    });
  }, [stripe, isProcessing, clientSecret]);

  // Handle card element changes
  const handleCardChange = (event: any) => {
    console.log('Card element changed:', event);
    if (event.complete) {
      console.log('Card information is complete');
    }
    if (event.error) {
      console.log('Card error:', event.error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'rgb(15, 15, 15)',
        '::placeholder': {
          color: 'rgb(113, 113, 122)',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-lg" style={{
        backgroundColor: 'rgba(15, 15, 15, 0.02)',
        border: '1px solid rgb(113, 113, 122)'
      }}>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={18} style={{ color: 'rgb(113, 113, 122)' }} />
          <span className="font-medium text-sm" style={{ color: 'rgb(15, 15, 15)' }}>Card Information</span>
          <Lock size={14} style={{ color: 'rgb(15, 15, 15)' }} />
        </div>

        <div className="p-3 rounded" style={{
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(113, 113, 122)'
        }}>
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>

        <p className="text-xs mt-2 flex items-center gap-1" style={{ color: 'rgb(113, 113, 122)' }}>
          <Lock size={12} />
          Secure & encrypted payment
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full text-white py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
        style={{ backgroundColor: 'rgb(15, 15, 15)' }}
        onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)')}
        onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)')}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <Lock size={16} />
            Complete Payment - ${amount.toFixed(2)}
          </>
        )}
      </button>
    </form>
  );
};

interface StripePaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const StripePaymentForm = (props: StripePaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePaymentForm;
