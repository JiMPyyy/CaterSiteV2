'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { sushiSidesAndAdditions } from '@/data/sushi';
import { SushiItem } from '@/types/menu';

interface SushiAdditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdditionsConfirm: (additions: { item: SushiItem; quantity: number }[]) => void;
  selectedItem?: SushiItem;
}

export default function SushiAdditionsModal({ 
  isOpen, 
  onClose, 
  onAdditionsConfirm, 
  selectedItem 
}: SushiAdditionsModalProps) {
  const [selectedAdditions, setSelectedAdditions] = useState<{ item: SushiItem; quantity: number }[]>([]);
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAdditions([]);
    }
  }, [isOpen]);

  const handleQuantityChange = (item: SushiItem, change: number) => {
    setSelectedAdditions(prev => {
      const existing = prev.find(addition => addition.item.id === item.id);
      
      if (existing) {
        const newQuantity = existing.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter(addition => addition.item.id !== item.id);
        }
        return prev.map(addition =>
          addition.item.id === item.id 
            ? { ...addition, quantity: newQuantity }
            : addition
        );
      } else if (change > 0) {
        return [...prev, { item, quantity: 1 }];
      }
      return prev;
    });
  };

  const getQuantity = (item: SushiItem) => {
    const addition = selectedAdditions.find(addition => addition.item.id === item.id);
    return addition ? addition.quantity : 0;
  };

  const getTotalPrice = () => {
    return selectedAdditions.reduce((total, addition) => 
      total + (addition.item.price * addition.quantity), 0
    );
  };

  const handleConfirm = () => {
    onAdditionsConfirm(selectedAdditions);
    onClose();
  };

  if (!isOpen) return null;

  // Group items by category
  const sauces = sushiSidesAndAdditions.filter(item => item.category === 'side' && 
    ['eel-sauce', 'yum-yum-sauce', 'spicy-yum-yum-sauce', 'ranch-dressing'].includes(item.id));
  const traditionalSides = sushiSidesAndAdditions.filter(item => item.category === 'side' && 
    ['wasabi', 'fresh-wasabi', 'pickled-ginger'].includes(item.id));
  const modifications = sushiSidesAndAdditions.filter(item => item.category === 'modification');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[60] p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop, not the modal content
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl"
        style={{ color: 'rgb(15, 15, 15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Additions & Sides</h2>
            <p className="text-gray-600 mt-1">
              {selectedItem ? `Add extras to ${selectedItem.name}` : 'Add sides and modifications'}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Sauces Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Sauces</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sauces.map((item) => {
                const quantity = getQuantity(item);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, -1);
                          }}
                          disabled={quantity === 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, 1);
                          }}
                          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traditional Sides Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Traditional Sides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {traditionalSides.map((item) => {
                const quantity = getQuantity(item);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, -1);
                          }}
                          disabled={quantity === 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, 1);
                          }}
                          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modifications Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Modifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modifications.map((item) => {
                const quantity = getQuantity(item);
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-green-600">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, -1);
                          }}
                          disabled={quantity === 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item, 1);
                          }}
                          className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div>
              {selectedAdditions.length > 0 && (
                <p className="text-sm text-gray-600">
                  Total additions: ${getTotalPrice().toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm();
                }}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {selectedAdditions.length > 0 ? 'Add to Selection' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
