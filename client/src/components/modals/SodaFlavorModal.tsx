'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';

interface SodaFlavorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSoda: any;
  onAddToCart: (item: any) => void;
}

export default function SodaFlavorModal({ isOpen, onClose, selectedSoda, onAddToCart }: SodaFlavorModalProps) {
  const [sodaQuantities, setSodaQuantities] = useState<{[key: string]: number}>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Reset quantities when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSodaQuantities({});
    }
  }, [isOpen]);

  // Auto-scroll to bottom when user makes a selection
  useEffect(() => {
    if (isOpen && selectedSoda) {
      const totalQuantity = Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0);
      const hasSelection = totalQuantity > 0;

      if (hasSelection && modalRef.current) {
        modalRef.current.scrollTo({
          top: modalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, selectedSoda, sodaQuantities]);

  const handleQuantityChange = (flavor: string, change: number) => {
    setSodaQuantities(prev => ({
      ...prev,
      [flavor]: Math.max(0, (prev[flavor] || 0) + change)
    }));
  };

  const handleAddToCart = () => {
    Object.entries(sodaQuantities).forEach(([flavor, quantity]) => {
      if (quantity > 0) {
        const sodaItem = {
          id: `${selectedSoda.id}-${flavor.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name: `${selectedSoda.name} - ${flavor}`,
          description: `${selectedSoda.description} - ${flavor} flavor`,
          price: selectedSoda.price,
          category: selectedSoda.category,
          dietaryInfo: selectedSoda.dietaryInfo,
          image: selectedSoda.image,
          quantity: quantity
        };
        onAddToCart(sodaItem);
      }
    });
    onClose();
  };

  if (!isOpen || !selectedSoda) return null;

  const totalQuantity = Object.values(sodaQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalCost = totalQuantity * selectedSoda.price;
  const hasSelection = totalQuantity > 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl"
        style={{ color: 'rgb(15, 15, 15)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">{selectedSoda.name}</h2>
            <p className="text-gray-600 mt-1">Select your flavors and quantities</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Soda Image */}
          <div className="mb-6">
            <img
              src={selectedSoda.image}
              alt={selectedSoda.name}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700">{selectedSoda.description}</p>
            <p className="text-lg font-semibold text-green-600 mt-2">
              ${selectedSoda.price.toFixed(2)} each
            </p>
          </div>

          {/* Flavor Selection */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">Available Flavors:</h3>
            {selectedSoda.flavors?.map((flavor: string) => (
              <div key={flavor} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-lg">{flavor}</h4>
                    <p className="text-sm text-gray-600">
                      ${selectedSoda.price.toFixed(2)} per bottle
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(flavor, -1)}
                      disabled={(sodaQuantities[flavor] || 0) === 0}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 text-center font-bold text-xl">
                      {sodaQuantities[flavor] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(flavor, 1)}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          {hasSelection && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-2">Order Summary:</h4>
              <div className="space-y-1 text-sm">
                {Object.entries(sodaQuantities).map(([flavor, quantity]) => {
                  if (quantity > 0) {
                    return (
                      <div key={flavor} className="flex justify-between">
                        <span>{quantity}× {flavor}</span>
                        <span>${(quantity * selectedSoda.price).toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total Bottles: {totalQuantity}</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xl font-bold">
              Total: ${totalCost.toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!hasSelection}
              className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
