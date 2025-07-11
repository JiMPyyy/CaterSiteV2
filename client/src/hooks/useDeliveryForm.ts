import { useState } from 'react';

export interface DeliveryInfo {
  date: string;
  time: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialInstructions: string;
}

export const useDeliveryForm = (initialData?: Partial<DeliveryInfo>) => {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    date: initialData?.date || '',
    time: initialData?.time || '',
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || 'NV', // Default to Nevada since this is CaterLV
      zipCode: initialData?.address?.zipCode || ''
    },
    specialInstructions: initialData?.specialInstructions || ''
  });

  // Update delivery info
  const updateDeliveryInfo = (updates: Partial<DeliveryInfo>) => {
    setDeliveryInfo(prev => ({
      ...prev,
      ...updates,
      address: {
        ...prev.address,
        ...(updates.address || {})
      }
    }));
  };

  // Update address specifically
  const updateAddress = (addressUpdates: Partial<DeliveryInfo['address']>) => {
    setDeliveryInfo(prev => ({
      ...prev,
      address: {
        ...prev.address,
        ...addressUpdates
      }
    }));
  };

  // Validate delivery info
  const validateDeliveryInfo = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!deliveryInfo.date) {
      errors.push('Delivery date is required');
    }

    if (!deliveryInfo.time) {
      errors.push('Delivery time is required');
    }

    if (!deliveryInfo.address.street) {
      errors.push('Street address is required');
    }

    if (!deliveryInfo.address.city) {
      errors.push('City is required');
    }

    if (!deliveryInfo.address.state) {
      errors.push('State is required');
    }

    if (!deliveryInfo.address.zipCode) {
      errors.push('ZIP code is required');
    }

    // Check if delivery is at least 12 hours in advance
    if (deliveryInfo.date && deliveryInfo.time) {
      const deliveryDateTime = new Date(`${deliveryInfo.date}T${deliveryInfo.time}`);
      const now = new Date();
      const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

      if (deliveryDateTime < twelveHoursFromNow) {
        errors.push('Orders must be placed at least 12 hours in advance of the delivery time');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Reset form
  const resetDeliveryInfo = () => {
    setDeliveryInfo({
      date: '',
      time: '',
      address: { street: '', city: '', state: 'NV', zipCode: '' },
      specialInstructions: ''
    });
  };

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

  return {
    deliveryInfo,
    setDeliveryInfo,
    updateDeliveryInfo,
    updateAddress,
    validateDeliveryInfo,
    resetDeliveryInfo,
    generateTimeOptions
  };
};
