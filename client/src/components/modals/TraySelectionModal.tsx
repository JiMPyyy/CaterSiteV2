'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';

interface TraySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTray: any;
  onAddToCart: (item: any) => void;
}

export default function TraySelectionModal({ isOpen, onClose, selectedTray, onAddToCart }: TraySelectionModalProps) {
  const [trayQuantities, setTrayQuantities] = useState<{small: number, large: number}>({small: 0, large: 0});
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
      setTrayQuantities({small: 0, large: 0});
    }
  }, [isOpen]);

  // Auto-scroll to bottom when user makes a selection
  useEffect(() => {
    if (isOpen && selectedTray) {
      const totalCost = (trayQuantities.small * (selectedTray.pricing?.small || 0)) +
                       (trayQuantities.large * (selectedTray.pricing?.large || 0));
      const hasSelection = trayQuantities.small > 0 || trayQuantities.large > 0;

      if (hasSelection && modalRef.current) {
        modalRef.current.scrollTo({
          top: modalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, selectedTray, trayQuantities]);

  const handleQuantityChange = (size: 'small' | 'large', change: number) => {
    setTrayQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, prev[size] + change)
    }));
  };

  const handleAddToCart = () => {
    if (trayQuantities.small > 0) {
      const smallTrayItem = {
        id: `${selectedTray.id}-small-${Date.now()}`,
        name: `${selectedTray.name} (Small)`,
        description: selectedTray.description,
        price: selectedTray.pricing?.small || 0,
        category: selectedTray.category,
        dietaryInfo: selectedTray.dietaryInfo,
        image: selectedTray.image,
        quantity: trayQuantities.small
      };
      onAddToCart(smallTrayItem);
    }

    if (trayQuantities.large > 0) {
      const largeTrayItem = {
        id: `${selectedTray.id}-large-${Date.now()}`,
        name: `${selectedTray.name} (Large)`,
        description: selectedTray.description,
        price: selectedTray.pricing?.large || 0,
        category: selectedTray.category,
        dietaryInfo: selectedTray.dietaryInfo,
        image: selectedTray.image,
        quantity: trayQuantities.large
      };
      onAddToCart(largeTrayItem);
    }

    onClose();
  };

  if (!isOpen || !selectedTray) return null;

  const totalCost = (trayQuantities.small * (selectedTray.pricing?.small || 0)) +
                   (trayQuantities.large * (selectedTray.pricing?.large || 0));
  const hasSelection = trayQuantities.small > 0 || trayQuantities.large > 0;

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
            <h2 className="text-2xl font-bold">{selectedTray.name}</h2>
            <p className="text-gray-600 mt-1">Select your tray size and quantity</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Tray Image */}
          <div className="mb-6">
            <img
              src={selectedTray.image}
              alt={selectedTray.name}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-700">{selectedTray.description}</p>
          </div>

          {/* Size Selection */}
          <div className="space-y-4 mb-8">
            {/* Small Tray */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Small Tray</h3>
                  <p className="text-sm text-gray-600">Serves 8-10 people</p>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    ${selectedTray.pricing?.small?.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange('small', -1)}
                    disabled={trayQuantities.small === 0}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-xl">
                    {trayQuantities.small}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('small', 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Large Tray */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">Large Tray</h3>
                  <p className="text-sm text-gray-600">Serves 12-15 people</p>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    ${selectedTray.pricing?.large?.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange('large', -1)}
                    disabled={trayQuantities.large === 0}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-xl">
                    {trayQuantities.large}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('large', 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {hasSelection && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-2">Order Summary:</h4>
              <div className="space-y-1 text-sm">
                {trayQuantities.small > 0 && (
                  <div className="flex justify-between">
                    <span>{trayQuantities.small}× Small Tray</span>
                    <span>${(trayQuantities.small * (selectedTray.pricing?.small || 0)).toFixed(2)}</span>
                  </div>
                )}
                {trayQuantities.large > 0 && (
                  <div className="flex justify-between">
                    <span>{trayQuantities.large}× Large Tray</span>
                    <span>${(trayQuantities.large * (selectedTray.pricing?.large || 0)).toFixed(2)}</span>
                  </div>
                )}
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
