'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { capriottisIndividualSandwiches } from '@/data/capriottis';

interface SamplerPlateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  selectedSize: 'small' | 'large';
}

export default function SamplerPlateModal({ isOpen, onClose, onAddToCart, selectedSize }: SamplerPlateModalProps) {
  const [selectedSandwiches, setSelectedSandwiches] = useState<{id: string, count: number}[]>([]);
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
      setSelectedSandwiches([]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when selection is complete
  useEffect(() => {
    if (isOpen) {
      const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
      const maxSandwiches = selectedSize === 'small' ? 3 : 4;
      const isComplete = totalSelected === maxSandwiches;

      if (isComplete && modalRef.current) {
        modalRef.current.scrollTo({
          top: modalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, selectedSandwiches, selectedSize]);

  // Calculate sampler price with Wagyu upcharges
  const calculateSamplerPrice = () => {
    const basePrice = selectedSize === 'small' ? 73.99 : 97.99;
    const wagyuUpcharge = 7.29;

    const wagyuCount = selectedSandwiches.reduce((count, item) => {
      const sandwich = capriottisIndividualSandwiches.find(s => s.id === item.id);
      // Only count Wagyu sandwiches
      return sandwich?.isWagyu ? count + item.count : count;
    }, 0);

    return basePrice + (wagyuCount * wagyuUpcharge);
  };

  const handleSandwichQuantityChange = (sandwichId: string, change: number) => {
    setSelectedSandwiches(prev => {
      const existing = prev.find(item => item.id === sandwichId);
      const totalSelected = prev.reduce((sum, item) => sum + item.count, 0);
      const maxSandwiches = selectedSize === 'small' ? 3 : 4;

      if (existing) {
        const newCount = existing.count + change;
        if (newCount <= 0) {
          return prev.filter(item => item.id !== sandwichId);
        }
        if (change > 0 && totalSelected >= maxSandwiches) {
          return prev; // Don't allow adding more if at max
        }
        return prev.map(item =>
          item.id === sandwichId ? { ...item, count: newCount } : item
        );
      } else if (change > 0 && totalSelected < maxSandwiches) {
        return [...prev, { id: sandwichId, count: 1 }];
      }
      return prev;
    });
  };

  const handleAddToCart = () => {
    const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
    const maxSandwiches = selectedSize === 'small' ? 3 : 4;

    if (totalSelected === maxSandwiches) {
      // Create description with quantities
      const sandwichDescriptions = selectedSandwiches.map(item => {
        const sandwich = capriottisIndividualSandwiches.find(s => s.id === item.id);
        return item.count > 1
          ? `${item.count}× ${sandwich?.name || ''}`
          : sandwich?.name || '';
      }).join(', ');

      const samplerItem = {
        id: `cap-sampler-${selectedSize}-${Date.now()}`,
        name: `Sampler Plate (${selectedSize === 'small' ? 'Small' : 'Large'})`,
        description: `Custom sampler plate: ${sandwichDescriptions}`,
        price: calculateSamplerPrice(),
        category: 'main' as const,
        dietaryInfo: [],
        image: '/menu/Capriottis-Bobbie-Tray.webp',
        quantity: 1,
        customization: {
          size: selectedSize,
          sandwiches: selectedSandwiches.map(item => ({
            name: capriottisIndividualSandwiches.find(s => s.id === item.id)?.name || '',
            count: item.count
          }))
        }
      };

      onAddToCart(samplerItem);
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
  const maxSandwiches = selectedSize === 'small' ? 3 : 4;
  const isComplete = totalSelected === maxSandwiches;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-400 shadow-2xl"
        style={{ color: 'rgb(15, 15, 15)' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Customize Your {selectedSize === 'small' ? 'Small' : 'Large'} Sampler Plate</h2>
            <p className="text-gray-600 mt-1">Choose {selectedSize === 'small' ? '3' : '4'} sandwiches - ${selectedSize === 'small' ? '73.99' : '97.99'} base price</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Sandwich Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">
              Select Sandwiches ({totalSelected}/{maxSandwiches})
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose your sandwich combinations. Wagyu options have a $7.29 upcharge per sandwich.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {capriottisIndividualSandwiches.map((sandwich) => {
                const selectedItem = selectedSandwiches.find(item => item.id === sandwich.id);
                const totalSelected = selectedSandwiches.reduce((sum, item) => sum + item.count, 0);
                const maxSandwiches = selectedSize === 'small' ? 3 : 4;
                const canAdd = totalSelected < maxSandwiches;

                return (
                  <div
                    key={sandwich.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <img
                      src={sandwich.image}
                      alt={sandwich.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm mb-2">{sandwich.name}</h4>
                    {sandwich.isWagyu && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mb-2 inline-block">
                        Wagyu +$7.29
                      </span>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSandwichQuantityChange(sandwich.id, -1)}
                          disabled={!selectedItem}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {selectedItem?.count || 0}
                        </span>
                        <button
                          onClick={() => handleSandwichQuantityChange(sandwich.id, 1)}
                          disabled={!canAdd && !selectedItem}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Summary */}
          {selectedSandwiches.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold mb-2">Selected Sandwiches:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSandwiches.map((selectedItem) => {
                  const sandwich = capriottisIndividualSandwiches.find(s => s.id === selectedItem.id);
                  return (
                    <span
                      key={selectedItem.id}
                      className="bg-white px-3 py-1 rounded-full text-sm border"
                    >
                      {selectedItem.count > 1 ? `${selectedItem.count}× ` : ''}{sandwich?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xl font-bold">
              Total: ${calculateSamplerPrice().toFixed(2)}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!isComplete}
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
