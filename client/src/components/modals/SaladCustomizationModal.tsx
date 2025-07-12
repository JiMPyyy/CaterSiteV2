'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface SaladCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  salad: MenuItem;
  onAddToCart: (customizedSalad: any) => void;
}

export default function SaladCustomizationModal({
  isOpen,
  onClose,
  salad,
  onAddToCart
}: SaladCustomizationModalProps) {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDressing, setSelectedDressing] = useState(salad?.saladOptions?.defaultDressing || '');
  const [extraDressings, setExtraDressings] = useState<string[]>([]);
  const [removedToppings, setRemovedToppings] = useState<string[]>([]);
  const [selectedCheese, setSelectedCheese] = useState<string[]>([]);
  const [selectedMeat, setSelectedMeat] = useState<string[]>([]);

  const handleToppingToggle = (topping: string) => {
    setSelectedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  const handleRemovedToppingToggle = (topping: string) => {
    setRemovedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  const handleExtraDressingToggle = (dressing: string) => {
    setExtraDressings(prev =>
      prev.includes(dressing)
        ? prev.filter(d => d !== dressing)
        : [...prev, dressing]
    );
  };

  const handleCheeseToggle = (cheese: string) => {
    setSelectedCheese(prev =>
      prev.includes(cheese)
        ? prev.filter(c => c !== cheese)
        : [...prev, cheese]
    );
  };

  const handleMeatToggle = (meat: string) => {
    setSelectedMeat(prev =>
      prev.includes(meat)
        ? prev.filter(m => m !== meat)
        : [...prev, meat]
    );
  };

  const calculateTotal = () => {
    let total = salad.price;
    if (salad.saladOptions?.extraDressingPrice && extraDressings.length > 0) {
      total += salad.saladOptions.extraDressingPrice * extraDressings.length;
    }
    // Add cheese prices
    if (salad.saladOptions?.cheeseOptions && selectedCheese.length > 0) {
      selectedCheese.forEach(cheese => {
        const cheeseOption = salad.saladOptions?.cheeseOptions?.find(c => c.name === cheese);
        if (cheeseOption) {
          total += cheeseOption.price;
        }
      });
    }
    // Add meat prices
    if (salad.saladOptions?.meatOptions && selectedMeat.length > 0) {
      selectedMeat.forEach(meat => {
        const meatOption = salad.saladOptions?.meatOptions?.find(m => m.name === meat);
        if (meatOption) {
          total += meatOption.price;
        }
      });
    }
    return total;
  };

  const handleAddToCart = () => {
    const customizedSalad = {
      id: salad.id,
      name: salad.name,
      description: salad.description,
      price: calculateTotal(),
      category: salad.category,
      dietaryInfo: salad.dietaryInfo,
      image: salad.image,
      quantity: 1,
      customization: {

        selectedToppings: selectedToppings.length > 0 ? selectedToppings : undefined,
        specialInstructions: specialInstructions.trim() || undefined,
        selectedDressing: selectedDressing !== salad.saladOptions?.defaultDressing ? selectedDressing : undefined,
        extraDressings: extraDressings.length > 0 ? extraDressings : undefined,
        removedToppings: removedToppings.length > 0 ? removedToppings : undefined,
        selectedCheese: selectedCheese.length > 0 ? selectedCheese : undefined,
        selectedMeat: selectedMeat.length > 0 ? selectedMeat : undefined
      }
    };

    onAddToCart(customizedSalad);
    onClose();
    
    // Reset form
    setSelectedToppings([]);
    setSpecialInstructions('');
    setSelectedDressing(salad?.saladOptions?.defaultDressing || '');
    setExtraDressings([]);
    setRemovedToppings([]);
    setSelectedCheese([]);
    setSelectedMeat([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-400"
          style={{ color: 'rgb(15, 15, 15)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 className="text-2xl font-bold">{salad.name}</h2>
              <p className="text-sm mt-1" style={{ color: 'rgb(113, 113, 122)' }}>
                Customize your salad tray
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgb(113, 113, 122)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="p-6">
            {/* Salad Description */}
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(15, 15, 15, 0.05)' }}>
              <p className="text-sm">{salad.description}</p>
            </div>

            {/* Dressing Selection */}
            {salad.saladOptions?.hasDressingSelection && salad.saladOptions.availableDressings && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Dressing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salad.saladOptions.availableDressings.map((dressing) => (
                    <label
                      key={dressing}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="dressing"
                        value={dressing}
                        checked={selectedDressing === dressing}
                        onChange={(e) => setSelectedDressing(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{dressing}</span>
                      {dressing === salad.saladOptions.defaultDressing && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Default</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Dressing */}
            {salad.saladOptions?.hasDressingSelection && salad.saladOptions.availableDressings && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Extra Dressing</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                  Add extra dressing for ${salad.saladOptions.extraDressingPrice?.toFixed(2)} each
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salad.saladOptions.availableDressings.map((dressing) => (
                    <label
                      key={dressing}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={extraDressings.includes(dressing)}
                        onChange={() => handleExtraDressingToggle(dressing)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{dressing}</span>
                      <span className="text-xs" style={{ color: 'rgb(113, 113, 122)' }}>
                        +${salad.saladOptions.extraDressingPrice?.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Remove Standard Toppings */}
            {salad.saladOptions?.hasRemovableToppings && salad.saladOptions.removableToppings && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Remove Standard Toppings</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                  Select toppings to remove from your salad
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salad.saladOptions.removableToppings.map((topping) => (
                    <label
                      key={topping}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={removedToppings.includes(topping)}
                        onChange={() => handleRemovedToppingToggle(topping)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{topping}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Toppings Section (for CAP'S Creation) */}
            {salad.saladOptions?.hasCustomToppings && salad.saladOptions.availableToppings && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Toppings</h3>
                <p className="text-sm mb-4" style={{ color: 'rgb(113, 113, 122)' }}>
                  (Optional) • Select up to 10
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salad.saladOptions.availableToppings.map((topping) => (
                    <label
                      key={topping}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping)}
                        onChange={() => handleToppingToggle(topping)}
                        disabled={!selectedToppings.includes(topping) && selectedToppings.length >= 10}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{topping}</span>
                    </label>
                  ))}
                </div>
                {selectedToppings.length >= 10 && (
                  <p className="text-xs mt-2" style={{ color: 'rgb(239, 68, 68)' }}>
                    Maximum 10 toppings selected
                  </p>
                )}
              </div>
            )}

            {/* Add Cheese Section (for CAP'S Creation) */}
            {salad.saladOptions?.hasAddCheese && salad.saladOptions.cheeseOptions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Add Cheese</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salad.saladOptions.cheeseOptions.map((cheese) => (
                    <label
                      key={cheese.name}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCheese.includes(cheese.name)}
                        onChange={() => handleCheeseToggle(cheese.name)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm flex-1">{cheese.name}</span>
                      <span className="text-xs font-medium" style={{ color: 'rgb(113, 113, 122)' }}>
                        +${cheese.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add Meat Section (for CAP'S Creation) */}
            {salad.saladOptions?.hasAddMeat && salad.saladOptions.meatOptions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Add Meat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {salad.saladOptions.meatOptions.map((meat) => (
                    <label
                      key={meat.name}
                      className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMeat.includes(meat.name)}
                        onChange={() => handleMeatToggle(meat.name)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm flex-1">{meat.name}</span>
                      <span className="text-xs font-medium" style={{ color: 'rgb(113, 113, 122)' }}>
                        +${meat.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {salad.saladOptions?.hasSpecialInstructions && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or dietary accommodations..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs mt-1" style={{ color: 'rgb(113, 113, 122)' }}>
                  {specialInstructions.length}/200 characters
                </p>
              </div>
            )}

            {/* Total and Add to Cart */}
            <div className="border-t border-gray-200 pt-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Base Price:</span>
                  <span className="text-sm">${salad.price.toFixed(2)}</span>
                </div>
                {extraDressings.length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Extra Dressing ({extraDressings.length}x):</span>
                    <span className="text-sm">+${((salad.saladOptions?.extraDressingPrice || 0) * extraDressings.length).toFixed(2)}</span>
                  </div>
                )}
                {selectedCheese.length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Cheese ({selectedCheese.length}x):</span>
                    <span className="text-sm">+${selectedCheese.reduce((total, cheese) => {
                      const cheeseOption = salad.saladOptions?.cheeseOptions?.find(c => c.name === cheese);
                      return total + (cheeseOption?.price || 0);
                    }, 0).toFixed(2)}</span>
                  </div>
                )}
                {selectedMeat.length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Meat ({selectedMeat.length}x):</span>
                    <span className="text-sm">+${selectedMeat.reduce((total, meat) => {
                      const meatOption = salad.saladOptions?.meatOptions?.find(m => m.name === meat);
                      return total + (meatOption?.price || 0);
                    }, 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
